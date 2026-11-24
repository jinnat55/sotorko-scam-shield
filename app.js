(function () {
  'use strict';
  var lang = 'bn';
  try { lang = localStorage.getItem('sotorko-lang') || 'en'; } catch (e) {}
  if (!/^(bn|en)$/.test(lang)) lang = 'bn';

  function stext(s) { return lang === 'en' && s.textEn ? s.textEn : s.text; }
  var T = {
    bn: {
      eyebrow: 'বাংলা + ইংরেজি · অফলাইনে চলে · ১০০% প্রাইভেট', h1a: 'ভুয়া মেসেজ চিনুন,', h1b: 'প্রতারণা থেকে বাঁচুন।',
      heroP: 'সন্দেহজনক SMS বা মেসেজ পেস্ট করুন। ১ সেকেন্ডে জানুন এটা প্রতারণা কি না, কেন, আর এখন কী করবেন।',
      cta: 'মেসেজ যাচাই করুন', demo: '▶ লাইভ ডেমো দেখুন', fl1: '🚨 "আপনার পিন ও OTP দিন"', fl2: '✅ অফিসিয়াল লিংক নিরাপদ',
      f1t: 'দুই ভাষায় শনাক্ত', f1d: '১৫+ ধরনের প্রতারণার ধরন বাংলা ও ইংরেজিতে ধরে',
      f2t: 'নকল লিংক ধরে', f2d: 'bkaash.com বা .xyz লুকালাইক ডোমেইন সঙ্গে সঙ্গে চেনে',
      f3t: 'পরিবারকে সতর্ক', f3d: 'এক ক্লিকে শেয়ারযোগ্য সতর্কবার্তা তৈরি',
      f4t: 'সম্পূর্ণ প্রাইভেট', f4d: 'সার্ভার নেই, ট্র্যাকিং নেই, ইন্টারনেট ছাড়াও চলে',
      title: 'সতর্ক', tag: 'মোবাইল ব্যাংকিং প্রতারণা ধরার সহজ হাতিয়ার', priv: '🔒 আপনার মেসেজ কোথাও যায় না',
      tabScan: 'মেসেজ যাচাই', tabQuiz: 'প্রতারণা চিনুন (কুইজ)', tabAbout: 'কীভাবে কাজ করে',
      ph: 'সন্দেহজনক SMS, WhatsApp বা Messenger মেসেজটি এখানে পেস্ট করুন…',
      scan: 'যাচাই করুন', clear: 'মুছুন', liveHint: 'বাংলা, ইংরেজি বা মিশ্র মেসেজ চলবে', ex: 'উদাহরণ:',
      disclaimer: 'এটি সম্ভাবনার হিসাব, চূড়ান্ত রায় নয়। সন্দেহ থাকলে অফিসিয়াল হেল্পলাইনে যাচাই করুন।',
      whyTitle: 'মেসেজের কোথায় সমস্যা', flagsTitle: 'যে লক্ষণগুলো পাওয়া গেছে', doTitle: 'এখন কী করবেন',
      share: 'পরিবারকে সতর্ক করার মেসেজ কপি করুন', copied: 'কপি হয়েছে ✓',
      empty: 'আগে কোনো মেসেজ পেস্ট করুন।', none: 'কোনো সুনির্দিষ্ট প্রতারণার লক্ষণ পাওয়া যায়নি।',
      combo: 'একসাথে একাধিক বিপজ্জনক লক্ষণ: ', type: 'ধরন: ',
      do1: 'লিংকে ক্লিক করবেন না, পিন বা OTP কাউকে দেবেন না।',
      do2: 'নিজের অফিসিয়াল অ্যাপ বা হেল্পলাইন থেকে বিষয়টি যাচাই করুন।',
      do3: 'টাকা পাঠানোর আগে বিশ্বস্ত কারও সঙ্গে কথা বলুন।',
      doLow: 'তবুও কোনো অচেনা লিংকে ক্লিক বা তথ্য শেয়ার করার আগে একবার ভাবুন।',
      helpTitle: 'অফিসিয়াল হেল্পলাইন', quizTitle: 'এই মেসেজটি কি প্রতারণা?', qScam: '🚨 প্রতারণা', qSafe: '✅ নিরাপদ',
      next: 'পরের মেসেজ →', right: 'সঠিক!', wrong: 'ভুল হয়েছে।', isScam: 'এটি আসলে প্রতারণা।', isSafe: 'এটি আসলে নিরাপদ।',
      engine: 'সতর্ক-এর হিসাব: ', pts: 'পয়েন্ট', correct: 'সঠিক', foot: 'সতর্ক — Creators AI Winter Challenge প্রজেক্ট · সব বিশ্লেষণ আপনার ব্রাউজারেই হয়',
      shareHead: '⚠️ সতর্কতা! এই ধরনের মেসেজ প্রতারণা হতে পারে:', shareWhy: 'কারণ:', shareTail: 'কাউকে পিন/OTP দেবেন না, লিংকে ক্লিক করবেন না। সন্দেহ হলে অফিসিয়াল হেল্পলাইনে ফোন করুন (বিকাশ ১৬২৪৭, নগদ ১৬১৬৭, ৯৯৯)।',
      aboutHtml: function () {
        return '<h2>সমস্যাটা কী?</h2><p>বাংলাদেশে প্রতিদিন হাজারো মানুষ মোবাইল ব্যাংকিংয়ের নামে ভুয়া SMS, ফোন ও লিংকের শিকার হন। প্রবীণ ও কম ডিজিটাল-অভিজ্ঞ মানুষ সবচেয়ে ঝুঁকিতে।</p>' +
          '<h2>সতর্ক কীভাবে কাজ করে</h2><ul class="clean"><li><b>বাংলা ও ইংরেজি দুটোই বোঝে:</b> পিন/OTP চাওয়া, ভুল ট্রান্সফারের ফাঁদ, লটারি, ফি দাবি, ঘরে বসে আয়, KYC ফিশিং ইত্যাদি ১৫+ ধরনের লক্ষণ চেনে।</li>' +
          '<li><b>নকল লিংক ধরে:</b> bkash-kyc-update.xyz বা bkaash.com এর মতো লুকালাইক ডোমেইন, শর্ট লিংক আর সন্দেহজনক ডোমেইন শেষাংশ।</li>' +
          '<li><b>আসল মেসেজকে ভুল ধরে না:</b> "কাউকে পিন শেয়ার করবেন না" ধরনের সতর্কবার্তা ও অফিসিয়াল ডোমেইন চিনে ঝুঁকি কমায়।</li>' +
          '<li><b>কেন সন্দেহজনক তা দেখায়:</b> মেসেজের বিপজ্জনক অংশ হাইলাইট করে সহজ বাংলায় ব্যাখ্যা দেয়।</li>' +
          '<li><b>পরিবারকে সতর্ক করা:</b> এক ক্লিকে শেয়ারযোগ্য সতর্কবার্তা তৈরি হয়।</li>' +
          '<li><b>কুইজ মোড:</b> নিজে চিনতে শিখুন, তারপর দেখুন ইঞ্জিন কী ধরেছে।</li></ul>' +
          '<h2>গোপনীয়তা</h2><p>কোনো সার্ভার, API বা ট্র্যাকিং নেই। সম্পূর্ণ বিশ্লেষণ আপনার ডিভাইসের ব্রাউজারে হয়, ইন্টারনেট ছাড়াও চলে।</p>' +
          '<h2>সীমাবদ্ধতা</h2><p>এটি নিয়ম-ভিত্তিক ইঞ্জিন, কোনো নতুন ধরনের প্রতারণা ধরতে না-ও পারে। এটি আইনি বা ব্যাংকিং পরামর্শ নয়।</p>' +
          '<h2>আগামী পরিকল্পনা</h2><ul class="clean"><li>LLM-ভিত্তিক গভীর বিশ্লেষণ (ঐচ্ছিক)</li><li>ব্রাউজার এক্সটেনশন ও Android SMS ফিল্টার</li><li>ব্যবহারকারীর রিপোর্ট থেকে নতুন প্যাটার্ন যোগ</li></ul>';
      }
    },
    en: {
      eyebrow: 'Bengali + English · Works offline · 100% private', h1a: 'Spot the fake message.', h1b: 'Stop the scam.',
      heroP: 'Paste a suspicious SMS or chat message. In one second, see whether it is a scam, why, and what to do next.',
      cta: 'Check a message', demo: '▶ Watch live demo', fl1: '🚨 "Share your PIN and OTP"', fl2: '✅ Official link is safe',
      f1t: 'Bilingual detection', f1d: '15+ scam patterns in Bengali and English',
      f2t: 'Fake-link radar', f2d: 'Catches bkaash.com and .xyz look-alike domains instantly',
      f3t: 'Protect family', f3d: 'One-tap shareable warning message',
      f4t: 'Fully private', f4d: 'No server, no tracking, works offline',
      title: 'Sotorko', tag: 'A simple shield against mobile-money scams', priv: '🔒 Your message never leaves your device',
      tabScan: 'Check a message', tabQuiz: 'Spot the scam (quiz)', tabAbout: 'How it works',
      ph: 'Paste the suspicious SMS, WhatsApp or Messenger text here…',
      scan: 'Check message', clear: 'Clear', liveHint: 'Works with Bengali, English or mixed text', ex: 'Try:',
      disclaimer: 'This is a risk estimate, not a final verdict. When in doubt, verify with the official helpline.',
      whyTitle: 'Where the message looks wrong', flagsTitle: 'Warning signs found', doTitle: 'What to do now',
      share: 'Copy a warning message for family', copied: 'Copied ✓',
      empty: 'Paste a message first.', none: 'No specific scam signs were found.',
      combo: 'Several dangerous signs together: ', type: 'Type: ',
      do1: 'Do not tap links and never share your PIN or OTP.',
      do2: 'Verify through your own official app or helpline.',
      do3: 'Talk to someone you trust before sending any money.',
      doLow: 'Still, think twice before tapping unknown links or sharing data.',
      helpTitle: 'Official helplines', quizTitle: 'Is this message a scam?', qScam: '🚨 Scam', qSafe: '✅ Safe',
      next: 'Next message →', right: 'Correct!', wrong: 'Not quite.', isScam: 'It is actually a scam.', isSafe: 'It is actually genuine.',
      engine: 'Sotorko scored it: ', pts: 'pts', correct: 'correct', foot: 'Sotorko — Creators AI Winter Challenge project · all analysis runs in your browser',
      shareHead: '⚠️ Warning! A message like this may be a scam:', shareWhy: 'Why:', shareTail: 'Never share your PIN/OTP and do not tap links. If unsure, call the official helpline (bKash 16247, Nagad 16167, 999).',
      aboutHtml: function () {
        return '<h2>The problem</h2><p>Every day thousands of people in Bangladesh get fake SMS, calls and links pretending to be mobile-money providers. Elderly and first-time digital users are the most exposed.</p>' +
          '<h2>How Sotorko works</h2><ul class="clean"><li><b>Bilingual:</b> understands Bengali and English; detects 15+ scam patterns such as PIN/OTP requests, wrong-transfer tricks, lotteries, advance fees, easy-income schemes and KYC phishing.</li>' +
          '<li><b>Catches fake links:</b> look-alike domains like bkash-kyc-update.xyz or bkaash.com, short links and risky domain endings.</li>' +
          '<li><b>Avoids false alarms:</b> recognises "never share your PIN" warnings and official domains and lowers the risk.</li>' +
          '<li><b>Explains itself:</b> highlights the dangerous parts and explains in plain language.</li>' +
          '<li><b>Protects family:</b> one tap creates a shareable warning.</li>' +
          '<li><b>Quiz mode:</b> learn to spot scams, then see what the engine caught.</li></ul>' +
          '<h2>Privacy</h2><p>No server, no API, no tracking. All analysis runs in your browser and works offline.</p>' +
          '<h2>Limits</h2><p>It is a rule-based engine and may miss brand-new scam styles. It is not legal or banking advice.</p>' +
          '<h2>Roadmap</h2><ul class="clean"><li>Optional LLM deep analysis</li><li>Browser extension and Android SMS filter</li><li>Community-reported patterns</li></ul>';
      }
    }
  };
  var HELP = [
    { n: { bn: 'বিকাশ', en: 'bKash' }, v: '16247' }, { n: { bn: 'নগদ', en: 'Nagad' }, v: '16167' },
    { n: { bn: 'রকেট', en: 'Rocket' }, v: '16216' }, { n: { bn: 'বাংলাদেশ ব্যাংক', en: 'Bangladesh Bank' }, v: '16236' },
    { n: { bn: 'জাতীয় জরুরি সেবা', en: 'National emergency' }, v: '999' }
  ];
  var COLORS = { critical: 'var(--critical)', high: 'var(--high)', caution: 'var(--caution)', low: 'var(--low)' };

  function $(id) { return document.getElementById(id); }
  function t(k) { return T[lang][k]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function digits(n) { return lang === 'bn' ? String(n).replace(/\d/g, function (d) { return '০১২৩৪৫৬৭৮৯'[d]; }) : String(n); }

  var lastReport = null;

  function applyStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i]').forEach(function (el) { var v = T[lang][el.getAttribute('data-i')]; if (typeof v === 'string') el.textContent = v; });
    $('input').placeholder = t('ph');
    $('langBtn').textContent = lang === 'bn' ? 'EN' : 'বাংলা';
    $('aboutBody').innerHTML = T[lang].aboutHtml();
    renderChips();
    $('qScam').textContent = t('qScam'); $('qSafe').textContent = t('qSafe');
    if (lastReport) render(lastReport.text);
    renderQuiz(true);
  }

  function renderChips() {
    var c = $('chips'); c.innerHTML = '<span class="hint">' + esc(t('ex')) + '</span>';
    window.SotorkoSamples.forEach(function (s) {
      var b = document.createElement('button'); b.className = 'chip'; b.textContent = s.name[lang];
      b.onclick = function () { $('input').value = stext(s); run(); };
      c.appendChild(b);
    });
  }

  function markClass(h) { return h.weight >= 30 ? '' : (h.weight >= 15 ? 'w-mid' : 'w-low'); }

  function render(text) {
    var r = Sotorko.analyze(text);
    lastReport = { text: text, r: r };
    $('result').classList.remove('hidden');
    var col = COLORS[r.level.id];
    var ringEl = $('ring'); ringEl.style.stroke = col; ringEl.style.color = col;
    ringEl.style.strokeDashoffset = 339.292;
    requestAnimationFrame(function () { requestAnimationFrame(function () { ringEl.style.strokeDashoffset = 339.292 * (1 - Math.max(r.score, 2) / 100); }); });
    countUp(r.score);
    var res = $('result'); res.classList.remove('go'); void res.offsetWidth; res.classList.add('go');
    var lt = $('lvlText'); lt.textContent = r.level.id === 'low' ? r.level[lang] : r.level[lang]; lt.className = 'lvl lvl-' + r.level.id;
    $('typeBadge').textContent = r.type ? t('type') + r.type[lang] : '';
    $('typeBadge').style.display = r.type ? '' : 'none';

    var wmap = {}; r.hits.forEach(function (h) { wmap[h.id] = h; });
    $('marked').innerHTML = r.segments.map(function (s) {
      if (!s.id) return esc(s.t);
      return '<mark class="' + markClass(wmap[s.id]) + '" title="' + esc(wmap[s.id].label[lang]) + '">' + esc(s.t) + '</mark>';
    }).join('');

    var f = $('findings');
    if (!r.hits.length) { f.innerHTML = '<div class="hint">' + esc(t('none')) + '</div>'; }
    else {
      f.innerHTML = r.hits.slice().sort(function (a, b) { return b.weight - a.weight; }).map(function (h) {
        var c = h.weight >= 30 ? 'var(--critical)' : (h.weight >= 15 ? 'var(--high)' : 'var(--caution)');
        return '<div class="find"><i class="dot" style="background:' + c + '"></i><div><b>' + esc(h.label[lang]) + '</b><span>' + esc(h.tip[lang]) + '</span></div></div>';
      }).join('');
    }
    $('combos').innerHTML = r.combos.map(function (c) { return '<div class="find"><i class="dot" style="background:var(--critical)"></i><div><b>' + esc(t('combo') + c[lang]) + '</b></div></div>'; }).join('');
    $('notes').innerHTML = r.notes.map(function (n) { return '<div style="margin-top:8px">ℹ️ ' + esc(n[lang]) + '</div>'; }).join('');

    var list = r.level.id === 'low' ? [t('doLow')] : [t('do1'), t('do2'), t('do3')];
    $('doList').innerHTML = list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    $('help').innerHTML = HELP.map(function (h) { return '<div>' + esc(h.n[lang]) + '<br><b>' + digits(h.v) + '</b></div>'; }).join('');
    $('shareBtn').style.display = r.level.id === 'low' ? 'none' : '';
    $('shareOk').textContent = '';
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  var cuTimer = null;
  function countUp(target) {
    clearInterval(cuTimer); var n = 0, el = $('scoreNum'); el.textContent = digits(0);
    if (!target) return;
    var step = Math.max(1, Math.round(target / 30));
    cuTimer = setInterval(function () { n = Math.min(target, n + step); el.textContent = digits(n); if (n >= target) clearInterval(cuTimer); }, 28);
  }
  function run() {
    var v = $('input').value;
    if (!v.trim()) { $('input').focus(); $('input').placeholder = t('empty'); return; }
    var box = $('scanBox'); box.classList.remove('scanning'); void box.offsetWidth; box.classList.add('scanning');
    setTimeout(function () { box.classList.remove('scanning'); render(v); }, 700);
  }

  function shareText() {
    var r = lastReport.r, snippet = lastReport.text.trim();
    if (snippet.length > 160) snippet = snippet.slice(0, 160) + '…';
    var why = r.hits.slice().sort(function (a, b) { return b.weight - a.weight; }).slice(0, 3).map(function (h) { return '• ' + h.label[lang]; }).join('\n');
    return t('shareHead') + '\n\n"' + snippet + '"\n\n' + t('shareWhy') + '\n' + why + '\n\n' + t('shareTail');
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (res) { var a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); res(); });
  }

  // ---- quiz ----
  var qOrder = [], qi = 0, qRight = 0, qTotal = 0, answered = false;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function renderQuiz(keep) {
    if (!qOrder.length) qOrder = shuffle(window.SotorkoSamples);
    var s = qOrder[qi % qOrder.length];
    $('quizMsg').textContent = stext(s);
    $('quizScore').textContent = digits(qRight) + ' / ' + digits(qTotal) + ' ' + t('correct');
    if (!keep || !answered) { $('quizFb').classList.add('hidden'); $('qNext').classList.add('hidden'); $('qScam').disabled = $('qSafe').disabled = false; answered = false; }
    else showFeedback(s, lastGuess);
  }
  var lastGuess = null;
  function showFeedback(s, guess) {
    var r = Sotorko.analyze(stext(s)), ok = (guess === s.scam);
    var h = '<div class="' + (ok ? 'ok' : 'bad') + '"><b>' + (ok ? t('right') : t('wrong')) + '</b> ' + (s.scam ? t('isScam') : t('isSafe')) + '</div>';
    h += '<div class="score" style="margin:6px 0">' + t('engine') + digits(r.score) + '/100 · ' + esc(r.level[lang]) + '</div>';
    if (r.hits.length) h += '<ul class="clean">' + r.hits.slice().sort(function (a, b) { return b.weight - a.weight; }).map(function (x) { return '<li>' + esc(x.label[lang]) + '</li>'; }).join('') + '</ul>';
    else if (r.notes.length) h += '<div class="hint">' + esc(r.notes[0][lang]) + '</div>';
    $('quizFb').innerHTML = h; $('quizFb').classList.remove('hidden'); $('qNext').classList.remove('hidden');
  }
  function answer(guess) {
    if (answered) return; answered = true; lastGuess = guess;
    var s = qOrder[qi % qOrder.length]; qTotal++; if (guess === s.scam) qRight++;
    $('qScam').disabled = $('qSafe').disabled = true;
    $('quizScore').textContent = digits(qRight) + ' / ' + digits(qTotal) + ' ' + t('correct');
    showFeedback(s, guess);
  }

  // ---- wiring ----
  document.querySelectorAll('nav button').forEach(function (b) {
    b.onclick = function () {
      document.querySelectorAll('nav button').forEach(function (x) { x.classList.toggle('on', x === b); });
      ['scan', 'quiz', 'about'].forEach(function (n) { $('tab-' + n).classList.toggle('hidden', n !== b.getAttribute('data-tab')); });
    };
  });
  $('scanBtn').onclick = run;
  $('demoBtn').onclick = function () { $('input').value = stext(window.SotorkoSamples[0]); document.getElementById('scanner').scrollIntoView({ behavior: 'smooth' }); setTimeout(run, 500); };
  $('clearBtn').onclick = function () { $('input').value = ''; $('result').classList.add('hidden'); lastReport = null; $('input').focus(); };
  $('input').addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run(); });
  $('shareBtn').onclick = function () { copy(shareText()).then(function () { $('shareOk').textContent = t('copied'); }); };
  $('langBtn').onclick = function () { lang = lang === 'bn' ? 'en' : 'bn'; try { localStorage.setItem('sotorko-lang', lang); } catch (e) {} applyStatic(); };
  $('qScam').onclick = function () { answer(true); };
  $('qSafe').onclick = function () { answer(false); };
  $('qNext').onclick = function () { qi++; answered = false; renderQuiz(false); };

  applyStatic();
})();
