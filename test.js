const S = require('./engine.js');
const samples = require('./samples.js');
let fail = 0;
samples.forEach(function (s) {
  const r = S.analyze(s.text);
  const ok = s.scam ? r.score >= 40 : r.score < 15;
  if (!ok) fail++;
  console.log((ok ? 'PASS' : 'FAIL'), s.id, 'score=' + r.score, r.level.id, r.hits.map(h => h.id).join(','));
});
// extra edge cases
const edge = [
  ['hello, lunch at 2?', v => v < 15],
  ['Click http://bkaash.com now', v => v >= 40],
  ['Your pin is never shared with anyone. Do not share your PIN.', v => v < 15],
  ['আপনার ওটিপি দিন', v => v >= 40],
  ['Send me your OTP, don\'t tell anyone', v => v >= 55]
];
edge.forEach(function (e) {
  const r = S.analyze(e[0]);
  const ok = e[1](r.score);
  if (!ok) fail++;
  console.log(ok ? 'PASS' : 'FAIL', JSON.stringify(e[0]), r.score, r.hits.map(h => h.id).join(','));
});
process.exit(fail ? 1 : 0);
