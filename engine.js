/*
 * Sotorko (সতর্ক) — scam message detection engine
 * Rule-based, runs fully offline in the browser or in Node. No network calls.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Sotorko = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var L = '(?<![a-zA-Z])', R = '(?![a-zA-Z])';
  var LB = '(?<![\\u0980-\\u09FF])', RB = '(?![\\u0980-\\u09FF])';

  function rx(src) { return new RegExp(src, 'gi'); }
  function findAll(text, re) {
    var out = [], m;
    re.lastIndex = 0;
    while ((m = re.exec(text))) {
      if (m[0].length === 0) { re.lastIndex++; continue; }
      out.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
    }
    return out;
  }
  function collect(text, srcs) {
    var out = [];
    srcs.forEach(function (s) { out = out.concat(findAll(text, rx(s))); });
    return out;
  }
  function overlaps(a, b) { return a.start < b.end && b.start < a.end; }

  // ---------- vocab ----------
  var SENS = '(?:পিন|পাসওয়ার্ড|ওটিপি|ভেরিফিকেশন\\s*কোড|সিভিভি|কার্ড\\s*নম্বর|' +
    L + 'pin' + R + '|' + L + 'otp' + R + '|' + L + 'password' + R + '|' + L + 'passcode' + R +
    '|verification\\s*code|' + L + 'cvv' + R + '|card\\s*number)';
  var VERB = '(?:' + LB + '(?:দিন|দেন|দিবেন|দিয়ে|দিতে|বলুন|বলেন|জানান|লিখুন|শেয়ার|পাঠান|পাঠাবেন)' + RB +
    '|' + L + '(?:send|share|tell|provide|give|enter|confirm|reply|submit)' + R + ')';

  var PROTECT = [
    SENS + '[^.!?\\n]{0,40}?(?:শেয়ার\\s*করবেন\\s*না|দেবেন\\s*না|দিবেন\\s*না|বলবেন\\s*না|জানাবেন\\s*না)',
    '(?:never|do\\s*not|don\\x27?t)\\s+(?:share|give|tell|disclose)[^.!?\\n]{0,40}?' + SENS,
    SENS + '[^.!?\\n]{0,30}?(?:never\\s+share|do\\s*not\\s+share)'
  ];

  var OFFICIAL = {
    bkash: 'bkash.com', nagad: 'nagad.com.bd', rocket: 'dutchbanglabank.com', upay: 'upaybd.com',
    daraz: 'daraz.com.bd', grameenphone: 'grameenphone.com', robi: 'robi.com.bd',
    banglalink: 'banglalink.net', pathao: 'pathao.com', facebook: 'facebook.com', google: 'google.com',
    whatsapp: 'whatsapp.com', bracbank: 'bracbank.com', dutchbangla: 'dutchbanglabank.com',
    islamibank: 'islamibankbd.com', sonalibank: 'sonalibank.com.bd', btrc: 'btrc.gov.bd'
  };
  var OFFICIAL_HOSTS = Object.keys(OFFICIAL).map(function (k) { return OFFICIAL[k]; });
  var SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'cutt.ly', 'rb.gy', 'is.gd', 'shorturl.at', 'tiny.cc', 'ow.ly'];
  var BAD_TLDS = ['xyz', 'top', 'click', 'live', 'icu', 'site', 'online', 'vip', 'club', 'work', 'buzz', 'cfd', 'sbs', 'rest', 'tk', 'ml', 'ga', 'cf', 'gq', 'link', 'shop'];
  var TLDS = 'com|net|org|info|xyz|top|click|live|icu|site|online|link|cc|co|bd|app|shop|vip|club|work|me|ly|gl|in|io|tk|ml|ga|cf|gq|buzz|cfd|sbs|rest|ru|cn|biz|us';
  var URL_RE = '(?:https?:\\/\\/)?(?:[a-z0-9-]+\\.)+(?:' + TLDS + ')(?![a-z])(?:[\\/?#][^\\s)]*)?';

  function levenshtein(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[m][n];
  }
  function deleet(s) { return s.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/4/g, 'a'); }
  function hostOf(raw) {
    var h = raw.replace(/^https?:\/\//i, '').split(/[\/?#]/)[0].toLowerCase().replace(/:\d+$/, '');
    return h.replace(/^www\./, '');
  }
  function isOfficial(host) {
    if (/\.gov\.bd$/.test(host)) return true;
    return OFFICIAL_HOSTS.some(function (d) { return host === d || host.slice(-(d.length + 1)) === '.' + d; });
  }
  function labelOf(host) {
    var p = host.split('.');
    if (p.length >= 3 && p[p.length - 1] === 'bd' && /^(com|gov|org|net|edu|co)$/.test(p[p.length - 2])) return p[p.length - 3];
    return p.length >= 2 ? p[p.length - 2] : p[0];
  }

  function analyzeUrls(text) {
    var res = { any: [], short: [], brand: [], tld: [], http: [], official: [] };
    findAll(text, rx(URL_RE)).forEach(function (m) {
      var host = hostOf(m.text);
      if (!/\./.test(host)) return;
      if (isOfficial(host)) { res.official.push(m); return; }
      res.any.push(m);
      if (SHORTENERS.indexOf(host) >= 0) res.short.push(m);
      var norm = deleet(host).replace(/[-._]/g, '');
      var flagged = Object.keys(OFFICIAL).some(function (k) { return norm.indexOf(k) >= 0; });
      if (!flagged) {
        var lab = deleet(labelOf(host));
        flagged = Object.keys(OFFICIAL).some(function (k) {
          return k.length >= 5 && lab !== k && levenshtein(lab, k) <= 2 && Math.abs(lab.length - k.length) <= 2;
        });
      }
      if (flagged) res.brand.push(m);
      var tld = host.split('.').pop();
      if (BAD_TLDS.indexOf(tld) >= 0) res.tld.push(m);
      if (/^http:\/\//i.test(m.text)) res.http.push(m);
    });
    return res;
  }

  // ---------- rules ----------
  var RULES = [
    {
      id: 'otp', weight: 40, type: { bn: 'OTP/পিন ফিশিং', en: 'OTP / PIN phishing' },
      label: { bn: 'পিন, OTP বা পাসওয়ার্ড চাওয়া হচ্ছে', en: 'Asks for your PIN, OTP or password' },
      tip: { bn: 'বিকাশ, নগদ বা ব্যাংক কখনোই পিন বা OTP চায় না। কাউকে দেবেন না, এমনকি কাস্টমার কেয়ার পরিচয় দিলেও না।', en: 'Genuine providers never ask for your PIN or OTP. Never share it, even with someone claiming to be customer care.' },
      find: function (t) {
        var prot = collect(t, PROTECT);
        var hits = collect(t, [SENS + '[^.!?\\n]{0,40}?' + VERB, VERB + '[^.!?\\n]{0,40}?' + SENS]);
        return hits.filter(function (h) { return !prot.some(function (p) { return overlaps(h, p); }); });
      }
    },
    {
      id: 'link_brand', weight: 45, type: { bn: 'ভুয়া লিংক ফিশিং', en: 'Fake-link phishing' },
      label: { bn: 'নামকরা প্রতিষ্ঠানের নকল ঠিকানা (লুকালাইক ডোমেইন)', en: 'Look-alike domain imitating a known brand' },
      tip: { bn: 'লিংকের ঠিকানা আসল প্রতিষ্ঠানের মতো দেখালেও আলাদা। লিংকে ক্লিক না করে অফিসিয়াল অ্যাপ বা ওয়েবসাইটে সরাসরি যান।', en: 'The address imitates a real brand but is not official. Do not click; open the official app or site directly.' },
      find: function (t, ctx) { return ctx.urls.brand; }
    },
    {
      id: 'link_short', weight: 20, type: { bn: 'লুকানো লিংক', en: 'Hidden link' },
      label: { bn: 'শর্ট লিংক, আসল গন্তব্য লুকানো', en: 'Shortened link hides the real destination' },
      tip: { bn: 'শর্ট লিংকের পেছনে কী আছে বোঝা যায় না। অচেনা উৎসের শর্ট লিংকে ক্লিক করবেন না।', en: 'You cannot see where a short link leads. Do not open short links from unknown senders.' },
      find: function (t, ctx) { return ctx.urls.short; }
    },
    {
      id: 'link_tld', weight: 12, type: { bn: 'সন্দেহজনক লিংক', en: 'Suspicious link' },
      label: { bn: 'প্রতারণায় বহুল ব্যবহৃত ডোমেইন শেষাংশ (.xyz, .top ইত্যাদি)', en: 'Domain ending commonly used in scams (.xyz, .top …)' },
      tip: { bn: 'আসল ব্যাংক ও মোবাইল ব্যাংকিং প্রতিষ্ঠান সাধারণত এসব ডোমেইন ব্যবহার করে না।', en: 'Real banks and mobile-money providers rarely use these domain endings.' },
      find: function (t, ctx) { return ctx.urls.tld; }
    },
    {
      id: 'link', weight: 12, type: { bn: 'অজানা লিংক', en: 'Unknown link' },
      label: { bn: 'অফিসিয়াল নয় এমন লিংক আছে', en: 'Contains a non-official link' },
      tip: { bn: 'মেসেজে আসা অচেনা লিংকে ক্লিক করার আগে থামুন। আপনার নিজের অ্যাপ থেকে যাচাই করুন।', en: 'Pause before tapping unknown links. Verify from your own app instead.' },
      find: function (t, ctx) { return ctx.urls.any; }
    },
    {
      id: 'link_http', weight: 5, type: { bn: 'অনিরাপদ লিংক', en: 'Insecure link' },
      label: { bn: 'লিংকটি HTTPS নয় (অনিরাপদ)', en: 'Link is not HTTPS' },
      tip: { bn: 'অনিরাপদ সংযোগে তথ্য চুরি হতে পারে।', en: 'Data on insecure connections can be intercepted.' },
      find: function (t, ctx) { return ctx.urls.http; }
    },
    {
      id: 'prize_strong', weight: 45, type: { bn: 'লটারি/পুরস্কারের ফাঁদ', en: 'Lottery / prize trap' },
      label: { bn: 'লটারি বা পুরস্কার জেতার দাবি', en: 'Claims you won a lottery or prize' },
      tip: { bn: 'যে লটারিতে অংশই নেননি তাতে জেতা সম্ভব নয়। পুরস্কারের লোভ দেখিয়ে সাধারণত ফি বা তথ্য চাওয়া হয়।', en: 'You cannot win a draw you never entered. Prize claims usually lead to fee or data requests.' },
      srcs: ['লটারি', 'জিতেছেন', 'জিতে\\s*নিয়েছেন', 'লাকি\\s*ড্র', 'বিজয়ী\\s*হয়েছেন', L + 'lottery' + R, 'you(?:\\x27ve|\\s+have)?\\s+won', 'lucky\\s*draw', L + 'jackpot' + R]
    },
    {
      id: 'promo', weight: 12, type: { bn: 'প্রলোভনের মেসেজ', en: 'Lure message' },
      label: { bn: 'বোনাস/উপহারের প্রলোভন', en: 'Bonus or gift lure' },
      tip: { bn: 'প্রলোভনের মেসেজ নিজে ক্ষতিকর নয়, কিন্তু লিংক বা তথ্য চাইলে সাবধান।', en: 'Offers alone are not harmful, but beware if a link or personal data is requested.' },
      srcs: ['অভিনন্দন', 'বোনাস', 'উপহার', 'ফ্রি\\s*(?:ডাটা|ইন্টারনেট|টাকা|রিচার্জ|মিনিট)', L + 'congratulations' + R, L + 'free\\s+gift' + R, L + 'bonus' + R]
    },
    {
      id: 'wrong_transfer', weight: 40, type: { bn: 'ভুল ট্রান্সফারের ফাঁদ', en: 'Wrong-transfer trick' },
      label: { bn: '"ভুল করে টাকা পাঠিয়েছি, ফেরত দিন" ধরনের দাবি', en: '"Sent money by mistake, send it back" claim' },
      tip: { bn: 'প্রায়ই নকল ট্রানজেকশন মেসেজ পাঠিয়ে এটা করা হয়। নিজের অ্যাপে ব্যালেন্স দেখুন; টাকা না এলে কিছু ফেরত দেবেন না।', en: 'Often paired with a fake transaction SMS. Check your balance in the real app; if no money arrived, send nothing back.' },
      srcs: ['ভুল(?:ে|\\s*করে|ক্রমে)?[^.!?\\n]{0,30}?(?:টাকা|পাঠিয়ে|পাঠিয়েছি)', 'ফেরত\\s*(?:দিন|দিবেন|পাঠান|দেন)', 'টাকা\\s*ফেরত', 'mistakenly\\s+sent', 'sent[^.!?\\n]{0,25}by\\s+mistake', 'return\\s+(?:the\\s+)?(?:money|amount)', 'send\\s+(?:it\\s+)?back']
    },
    {
      id: 'payment', weight: 30, type: { bn: 'অগ্রিম ফি প্রতারণা', en: 'Advance-fee fraud' },
      label: { bn: 'আগে ফি, চার্জ বা টাকা পাঠাতে বলা হচ্ছে', en: 'Asks you to pay a fee or send money first' },
      tip: { bn: 'চাকরি, পুরস্কার বা ঋণের আগে ফি চাইলে সেটা প্রায় নিশ্চিতভাবে প্রতারণা।', en: 'Fees demanded before a job, prize or loan are almost always fraud.' },
      srcs: ['প্রসেসিং\\s*ফি', 'রেজিস্ট্রেশন\\s*ফি', 'ফি\\s*(?:দিতে|পাঠান|জমা)', 'চার্জ\\s*(?:দিতে|পাঠান)', 'টাকা\\s*(?:পাঠান|পাঠাতে|জমা)', 'ডিপোজিট\\s*(?:করুন|করতে)', L + 'send\\s+(?:money|tk|taka|usd)' + R, 'pay\\s+(?:a\\s+)?(?:fee|charge|deposit)', 'processing\\s+fee', 'registration\\s+fee', 'advance\\s+payment']
    },
    {
      id: 'kyc', weight: 22, type: { bn: 'KYC/অ্যাকাউন্ট ভেরিফিকেশন ফিশিং', en: 'KYC / account-verification phishing' },
      label: { bn: 'KYC, আপডেট বা ভেরিফিকেশনের নামে তথ্য চাওয়া', en: 'Requests KYC / update / verification' },
      tip: { bn: 'KYC আপডেট দরকার হলে অফিসিয়াল অ্যাপ বা শাখা থেকে করুন, মেসেজের লিংক থেকে নয়।', en: 'Do KYC updates only inside the official app or branch, never via a link in a message.' },
      srcs: ['কেওয়াইসি', L + 'kyc' + R, 'আপডেট\\s*(?:করুন|করতে)', 'ভেরিফাই\\s*(?:করুন|করতে)', 'যাচাই\\s*(?:করুন|করতে)', 'verify\\s+your', 'update\\s+your', 'confirm\\s+your\\s+(?:account|identity|details)', 'জাতীয়\\s*পরিচয়\\s*পত্র']
    },
    {
      id: 'urgency', weight: 20, type: { bn: 'ভয় দেখানো মেসেজ', en: 'Pressure / threat message' },
      label: { bn: 'তাড়াহুড়ো বা অ্যাকাউন্ট বন্ধের ভয়', en: 'Urgency or account-closure threat' },
      tip: { bn: 'প্রতারকরা ভাবার সময় দিতে চায় না। থামুন, নিজে অফিসিয়াল নম্বরে যোগাযোগ করে যাচাই করুন।', en: 'Scammers do not want you to think. Stop and verify through an official channel.' },
      srcs: ['অ্যাকাউন্ট(?:টি)?\\s*(?:বন্ধ|ব্লক|স্থগিত|সাসপেন্ড)', 'বন্ধ\\s*হয়ে\\s*যাবে', 'ব্লক\\s*হয়ে\\s*যাবে', 'ব্লক\\s*করা\\s*হবে', 'বন্ধ\\s*করে\\s*দেওয়া\\s*হবে', '[০-৯0-9]+\\s*ঘ[ণন]্টার\\s*মধ্যে', 'এখনই', 'এক্ষুনি', 'অবিলম্বে', 'শেষ\\s*সুযোগ', 'সীমিত\\s*সময়', L + 'immediately' + R, L + 'urgent(?:ly)?' + R, 'within\\s+\\d+\\s*(?:hours|hrs|minutes|mins)', L + 'suspend(?:ed)?' + R, L + 'blocked' + R, L + 'deactivat(?:ed|e)' + R, 'last\\s+warning']
    },
    {
      id: 'invest', weight: 30, type: { bn: 'বিনিয়োগ/ঘরে বসে আয়ের প্রতারণা', en: 'Investment / easy-income scam' },
      label: { bn: 'ঘরে বসে আয়, নিশ্চিত মুনাফা বা দ্বিগুণ করার প্রতিশ্রুতি', en: 'Promises easy income, guaranteed profit or doubling' },
      tip: { bn: 'নিশ্চিত মুনাফা বলে কিছু নেই। অচেনা কাউকে টাকা বিনিয়োগ করবেন না।', en: 'There is no such thing as guaranteed profit. Never invest with unknown parties.' },
      srcs: ['ঘরে\\s*বসে', 'দৈনিক\\s*[০-৯0-9,]+\\s*টাকা', 'আয়\\s*করুন', 'ইনভেস্ট', 'বিনিয়োগ', 'দ্বিগুণ', 'নিশ্চিত\\s*মুনাফা', 'গ্যারান্টি', 'পার্ট\\s*টাইম\\s*(?:জব|কাজ)', 'work\\s+from\\s+home', 'earn\\s+\\$?\\d+', 'guaranteed\\s+(?:profit|return|income)', 'double\\s+your', 'part[- ]time\\s+job', L + 'crypto' + R]
    },
    {
      id: 'impersonation', weight: 15, type: { bn: 'প্রতিষ্ঠান/কর্তৃপক্ষ সেজে প্রতারণা', en: 'Impersonation scam' },
      label: { bn: 'কাস্টমার কেয়ার, ব্যাংক বা কর্তৃপক্ষ পরিচয়', en: 'Claims to be customer care, bank or authority' },
      tip: { bn: 'পরিচয় দেওয়া যে কেউ করতে পারে। নিজে অফিসিয়াল হেল্পলাইনে ফোন দিয়ে যাচাই করুন।', en: 'Anyone can claim an identity. Call the official helpline yourself to verify.' },
      srcs: ['কাস্টমার\\s*কেয়ার', 'গ্রাহক\\s*সেবা', 'এজেন্ট', 'বিকাশ\\s*(?:থেকে|অফিস|কর্তৃপক্ষ)', 'নগদ\\s*(?:থেকে|অফিস|কর্তৃপক্ষ)', 'ব্যাংক\\s*(?:থেকে|অফিসার|কর্মকর্তা)', 'পুলিশ', 'সিআইডি', 'বিটিআরসি', 'গ্রেফতার', 'গ্রেপ্তার', 'customer\\s*care', 'bank\\s*officer', L + 'police' + R, L + 'arrest' + R]
    },
    {
      id: 'secrecy', weight: 20, type: { bn: 'গোপনীয়তার চাপ', en: 'Secrecy pressure' },
      label: { bn: '"কাউকে বলবেন না" বলে গোপন রাখতে চাপ', en: 'Pressures you to keep it secret' },
      tip: { bn: 'গোপন রাখতে বলা প্রতারণার বড় লক্ষণ। বিশ্বস্ত কাউকে জানান।', en: 'Demanding secrecy is a classic scam sign. Tell someone you trust.' },
      find: function (t) {
        var prot = collect(t, PROTECT);
        var hits = collect(t, [LB + 'কাউকে[^.!?\\n]{0,25}?(?:বলবেন|জানাবেন)\\s*না', 'গোপন\\s*(?:রাখুন|রাখবেন|রাখতে)', '(?:do\\s*not|don\\x27?t)\\s+tell\\s+(?:anyone|anybody)', 'keep\\s+(?:this\\s+)?(?:a\\s+)?secret', L + 'confidential' + R]);
        return hits.filter(function (h) { return !prot.some(function (p) { return overlaps(h, p); }); });
      }
    },
    {
      id: 'contact', weight: 18, type: { bn: 'ব্যক্তিগত নম্বরে যোগাযোগের ফাঁদ', en: 'Off-platform contact lure' },
      label: { bn: 'ব্যক্তিগত নম্বর, হোয়াটসঅ্যাপ বা টেলিগ্রামে যোগাযোগ করতে বলা', en: 'Pushes you to a personal number / WhatsApp / Telegram' },
      tip: { bn: 'অফিসিয়াল সেবা আপনাকে ব্যক্তিগত নম্বরে বা চ্যাট অ্যাপে টেনে নেয় না।', en: 'Official services do not move you to personal numbers or chat apps.' },
      srcs: [
        '(?:call|contact|whatsapp|কল|যোগাযোগ|হোয়াটসঅ্যাপ|টেলিগ্রাম)[^\\n]{0,60}?(?:\\+?88)?(?:01[3-9]\\d{8}|০১[৩-৯][০-৯]{8})',
        '(?:\\+?88)?(?:01[3-9]\\d{8}|০১[৩-৯][০-৯]{8})[^\\n]{0,40}?(?:call|contact|whatsapp|কল|যোগাযোগ|হোয়াটসঅ্যাপ|টেলিগ্রাম)',
        'হোয়াটস\\s*অ্যাপ', 'টেলিগ্রাম', L + 'whatsapp' + R, L + 'telegram' + R
      ]
    },
    {
      id: 'ussd', weight: 12, type: { bn: 'কোড ডায়াল করানো', en: 'Dial-code trick' },
      label: { bn: 'অজানা কোড ডায়াল করতে বলা', en: 'Asks you to dial a code' },
      tip: { bn: 'যে কোড বোঝেন না তা ডায়াল করবেন না; কিছু কোডে কল ফরওয়ার্ড বা অ্যাকাউন্ট নিয়ন্ত্রণ চলে যেতে পারে।', en: 'Do not dial codes you do not understand; some codes forward calls or hand over control.' },
      srcs: ['\\*\\d{1,4}(?:\\*[\\d]+)*#[^\\n]{0,15}?(?:ডায়াল|dial)', '(?:ডায়াল|dial)[^\\n]{0,25}?\\*\\d{1,4}(?:\\*[\\d]+)*#']
    },
    {
      id: 'style', weight: 6, type: { bn: 'সন্দেহজনক ভঙ্গি', en: 'Suspicious style' },
      label: { bn: 'অতিরিক্ত বিস্ময়চিহ্ন বা বড় হাতের অক্ষর', en: 'Excessive exclamation marks or CAPS' },
      tip: { bn: 'আসল প্রতিষ্ঠানের মেসেজ সাধারণত শান্ত ও পরিমিত হয়।', en: 'Genuine institutions write calmly and consistently.' },
      find: function (t) {
        var out = [];
        findAll(t, /!{3,}|!(?:\s*!){2,}/g).forEach(function (m) { out.push(m); });
        var letters = (t.match(/[A-Za-z]/g) || []);
        var caps = (t.match(/[A-Z]/g) || []);
        if (letters.length >= 25 && caps.length / letters.length > 0.6) out.push({ start: 0, end: Math.min(t.length, 20), text: t.slice(0, 20) });
        return out;
      }
    }
  ];

  var COMBOS = [
    { need: ['otp', ['urgency', 'link', 'link_brand', 'kyc']], bn: 'পিন/OTP চাওয়া + তাড়াহুড়ো বা লিংক একসাথে', en: 'PIN/OTP request combined with urgency or a link' },
    { need: [['link', 'link_brand'], ['prize_strong', 'kyc', 'urgency']], bn: 'লিংক + প্রলোভন বা ভয় একসাথে', en: 'Link combined with a lure or a threat' },
    { need: ['wrong_transfer', ['contact', 'secrecy']], bn: 'ভুল ট্রান্সফারের দাবি + যোগাযোগ বা গোপনীয়তা', en: 'Wrong-transfer claim plus contact or secrecy push' },
    { need: ['secrecy', ['otp', 'payment']], bn: 'গোপনীয়তার চাপ + পিন বা টাকা চাওয়া', en: 'Secrecy pressure plus a PIN or payment request' }
  ];

  var LEVELS = [
    { min: 70, id: 'critical', bn: 'প্রায় নিশ্চিত প্রতারণা', en: 'Almost certainly a scam' },
    { min: 40, id: 'high', bn: 'উচ্চ ঝুঁকি, প্রতারণা হতে পারে', en: 'High risk, likely a scam' },
    { min: 15, id: 'caution', bn: 'সন্দেহজনক, সতর্ক থাকুন', en: 'Suspicious, be careful' },
    { min: 0, id: 'low', bn: 'তুলনামূলক নিরাপদ মনে হচ্ছে', en: 'Looks low-risk' }
  ];

  function levelOf(score) {
    for (var i = 0; i < LEVELS.length; i++) if (score >= LEVELS[i].min) return LEVELS[i];
    return LEVELS[LEVELS.length - 1];
  }

  function analyze(text) {
    text = String(text || '');
    var ctx = { urls: analyzeUrls(text) };
    var hits = [];
    RULES.forEach(function (r) {
      var m = r.find ? r.find(text, ctx) : collect(text, r.srcs);
      if (m && m.length) hits.push({ id: r.id, weight: r.weight, type: r.type, label: r.label, tip: r.tip, matches: m });
    });
    // brand-lookalike already explains the link; avoid double counting generic link rule
    var ids = hits.map(function (h) { return h.id; });
    if (ids.indexOf('link_brand') >= 0) hits = hits.filter(function (h) { return h.id !== 'link'; });
    ids = hits.map(function (h) { return h.id; });

    var combos = [];
    COMBOS.forEach(function (c) {
      var ok = c.need.every(function (n) {
        return Array.isArray(n) ? n.some(function (x) { return ids.indexOf(x) >= 0; }) : ids.indexOf(n) >= 0;
      });
      if (ok) combos.push({ bn: c.bn, en: c.en });
    });

    var keep = 1;
    hits.forEach(function (h) { keep *= (1 - h.weight / 100); });
    combos.forEach(function () { keep *= 0.8; });
    var score = Math.round((1 - keep) * 100);

    var top = hits.slice().sort(function (a, b) { return b.weight - a.weight; })[0];
    var lvl = levelOf(score);

    // highlight segments (higher weight wins overlaps)
    var ranges = [];
    hits.slice().sort(function (a, b) { return b.weight - a.weight; }).forEach(function (h) {
      h.matches.forEach(function (m) {
        if (!ranges.some(function (r) { return overlaps(r, m); })) ranges.push({ start: m.start, end: m.end, id: h.id });
      });
    });
    ranges.sort(function (a, b) { return a.start - b.start; });
    var segments = [], pos = 0;
    ranges.forEach(function (r) {
      if (r.start > pos) segments.push({ t: text.slice(pos, r.start), id: null });
      segments.push({ t: text.slice(r.start, r.end), id: r.id });
      pos = r.end;
    });
    if (pos < text.length) segments.push({ t: text.slice(pos), id: null });

    var notes = [];
    if (/trx\s*id|ট্রানজেকশন\s*আইডি|txn\s*id/i.test(text)) {
      notes.push({
        bn: 'এটি ট্রানজেকশন নোটিশের মতো দেখাচ্ছে। তবে নকল ট্রানজেকশন মেসেজও পাঠানো হয়, তাই নিজের অ্যাপে ব্যালেন্স মিলিয়ে নিন।',
        en: 'This looks like a transaction notice. Fake ones exist too, so confirm the balance inside your own app.'
      });
    }
    if (ctx.urls.official.length) {
      notes.push({ bn: 'অফিসিয়াল ডোমেইনের লিংক পাওয়া গেছে, এটি ভালো লক্ষণ।', en: 'An official-domain link was found, which is a good sign.' });
    }
    if (collect(text, PROTECT).length) {
      notes.push({ bn: 'মেসেজে পিন/OTP শেয়ার না করার সতর্কবার্তা আছে, এটি আসল মেসেজের লক্ষণ।', en: 'The message warns you not to share your PIN/OTP, typical of genuine notices.' });
    }

    return {
      score: score, level: lvl, type: top ? top.type : null, hits: hits,
      combos: combos, segments: segments, notes: notes, empty: text.trim().length === 0
    };
  }

  return { analyze: analyze, levelOf: levelOf, LEVELS: LEVELS, RULES: RULES, _levenshtein: levenshtein };
});
