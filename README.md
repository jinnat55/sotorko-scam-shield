# সতর্ক (Sotorko) — Scam Shield for Mobile Money

Paste a suspicious SMS / WhatsApp / Messenger message (Bengali, English or mixed) and Sotorko tells you **how risky it is, why, and what to do** — instantly, offline, in your browser.

Built for the **Creators AI Winter Challenge** (Devpost).

## Screenshots
See the `screenshots/` folder (3D hero shield, scan result, highlighted reasons, helplines, quiz, English mode).

## The problem
Every day, thousands of people in Bangladesh receive fake messages impersonating bKash, Nagad, banks and telecoms: "share your OTP", "account will be blocked in 24 hours", "I sent money by mistake, please return it", lottery wins, fake KYC links, easy-income schemes. Elderly and first-time digital users lose real money.

## What it does
- **Bilingual detection** (Bengali + English + mixed) of 15+ scam patterns: PIN/OTP requests, wrong-transfer trick, lottery/prize, advance fees, KYC phishing, easy-income/investment, impersonation, secrecy pressure, off-platform contact, dial-code tricks.
- **Fake-link detection**: look-alike domains (`bkash-kyc-update.xyz`, `bkaash.com`), URL shorteners, risky TLDs, non-HTTPS.
- **Low false alarms**: recognises genuine notices ("never share your PIN", official domains, transaction receipts) and lowers risk.
- **Explainable**: highlights the dangerous phrases and explains each sign in plain language.
- **Family shield**: one tap copies a ready-made warning message to forward to relatives.
- **Quiz mode**: learn to spot scams, then see what the engine caught.
- **Privacy-first**: no server, no API, no tracking. Works offline.

## How it works
`engine.js` is a transparent, weighted rule engine. Each matched sign carries a weight; the score is a combined probability `1 - Π(1 - wᵢ)` with a boost when dangerous signs co-occur (e.g. OTP request + urgency). URLs are parsed and compared to official brand domains using normalisation (leet-speak) and Levenshtein distance.

## Run it
No build step.
```bash
# open directly
open index.html
# or serve
python3 -m http.server 8000   # then visit http://localhost:8000
# run engine tests
node test.js
```

## Deploy (GitHub Pages)
Repo → Settings → Pages → Branch `main` / root. Your demo URL will be `https://<user>.github.io/<repo>/`.

## Files
| File | Purpose |
|---|---|
| `index.html` | UI |
| `app.js` | UI logic, bilingual strings, quiz |
| `engine.js` | Scam detection engine (works in browser and Node) |
| `fx.js` | 3D wireframe shield (Canvas, no libraries) and card tilt effects |
| `samples.js` | Example/quiz messages |
| `test.js` | Engine tests |

## Limitations
Rule-based, so it can miss brand-new scam styles; it is a risk estimate, not a final verdict or banking/legal advice. Helpline numbers should be checked against official sources before relying on them.

## Roadmap
Optional LLM deep-analysis mode, browser extension, Android SMS filter, community-reported patterns.

## Credits
All code written for this hackathon. Fonts: Hind Siliguri and Inter (Google Fonts, OFL). No other third-party libraries.
