/* Sample messages used by the "Try an example" chips and the quiz. scam:true = fraudulent. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SotorkoSamples = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    { id: 's1', scam: true, name: { bn: 'ভুয়া KYC লিংক', en: 'Fake KYC link' },
      text: 'বিকাশ কর্তৃপক্ষ: আপনার অ্যাকাউন্টটি ২৪ ঘণ্টার মধ্যে বন্ধ হয়ে যাবে। এখনই KYC আপডেট করতে লিংকে ক্লিক করুন: http://bkash-kyc-update.xyz এবং আপনার পিন ও ওটিপি দিন।' },
    { id: 's2', scam: true, name: { bn: 'লটারির ফাঁদ', en: 'Lottery trap' },
      text: 'অভিনন্দন! আপনি লাকি ড্রতে ৫০,০০,০০০ টাকা জিতেছেন। পুরস্কার পেতে প্রসেসিং ফি ৫০০ টাকা পাঠান। যোগাযোগ: 01712345678 (হোয়াটসঅ্যাপ)' },
    { id: 's3', scam: true, name: { bn: 'ভুল ট্রান্সফার', en: 'Wrong transfer' },
      text: 'ভাই, ভুল করে আপনার নম্বরে ৫,০০০ টাকা পাঠিয়ে ফেলেছি। প্লিজ টাকাটা ফেরত দিন, আমি খুব বিপদে আছি। কাউকে বলবেন না।' },
    { id: 's4', scam: true, name: { bn: 'English phishing', en: 'English phishing' },
      text: 'Dear customer, your Nagad account is suspended. Verify immediately at https://nagad-secure.top or share your OTP to restore access.' },
    { id: 's5', scam: true, name: { bn: 'ঘরে বসে আয়', en: 'Easy-income scam' },
      text: 'ঘরে বসে দৈনিক ৩০০০ টাকা আয় করুন! নিশ্চিত মুনাফা, ১০০% গ্যারান্টি। রেজিস্ট্রেশন ফি ১০০০ টাকা। টেলিগ্রামে যোগাযোগ করুন।' },
    { id: 'l1', scam: false, name: { bn: 'আসল ট্রানজেকশন', en: 'Genuine transaction' },
      text: 'You have received Tk 1,500.00 from 01712345678. Fee Tk 0.00. Balance Tk 2,340.50. TrxID 9K4L2M7P at 24/11/2026 10:15' },
    { id: 'l2', scam: false, name: { bn: 'আসল ক্যাশ-ইন', en: 'Genuine cash-in' },
      text: 'আপনার বিকাশ অ্যাকাউন্টে ৫০০ টাকা ক্যাশ ইন সফল হয়েছে। ব্যালেন্স ১,২০০ টাকা। কাউকে আপনার পিন শেয়ার করবেন না।' },
    { id: 'l3', scam: false, name: { bn: 'আসল অর্ডার আপডেট', en: 'Genuine order update' },
      text: 'Your Daraz order #12345 has been shipped. Track it at https://www.daraz.com.bd/track' },
    { id: 'l4', scam: false, name: { bn: 'আসল প্যাকেজ নোটিশ', en: 'Genuine package notice' },
      text: 'আপনার গ্রামীণফোন ইন্টারনেট প্যাকেজের মেয়াদ আগামীকাল শেষ হবে। রিনিউ করতে *121*3# ডায়াল করুন।' }
  ];
});
