# Devpost submission text (copy into the fields)

## Project title
সতর্ক (Sotorko) — Scam Shield for Mobile Money

## Tagline
Paste a suspicious Bengali or English message and instantly see if it is a scam, why, and what to do. Private, offline, free.

## Inspiration / Problem
Mobile money is how millions in Bangladesh send and receive money, and scammers exploit it daily with fake OTP requests, "money sent by mistake" tricks, lottery wins, fake KYC links and easy-income schemes. Elderly and first-time digital users are hit hardest, and most anti-fraud tools are English-only, app-heavy or send your private messages to a server.

## What it does
Sotorko analyses any pasted SMS/WhatsApp/Messenger message and returns: a 0-100 risk score, a plain-language verdict, the scam type, the exact dangerous phrases highlighted in the message, an explanation of each warning sign, concrete next steps with official helpline numbers, and a one-tap shareable warning for family. A quiz mode trains people to recognise scams themselves.

## Who benefits
Everyday mobile-money users, especially elderly and first-time digital users; families who want to protect relatives; community and digital-literacy trainers.

## What makes it distinctive
- Truly bilingual (Bengali, English and mixed text) detection.
- Look-alike domain detection (`bkash-kyc-update.xyz`, `bkaash.com`) using normalisation and edit distance.
- Reduces false alarms by recognising genuine notices (official domains, "never share your PIN" warnings).
- Fully explainable and fully private: everything runs in the browser, no data leaves the device, works offline.
- Teaches users through quiz mode, not only protects them.

## How it works / Tech
Vanilla JavaScript (no frameworks, no build step). A transparent weighted rule engine (`engine.js`) combines signs with a probabilistic score `1 - Π(1 - wᵢ)` and a co-occurrence boost. URL analysis uses parsing, brand-domain matching and Levenshtein distance. UI in HTML/CSS/JS with Bengali/English toggle. Tested with Node. Hosted on GitHub Pages.

## Challenges
Bengali has no regex word boundaries, so patterns use Unicode-range look-arounds. Distinguishing genuine "do not share your PIN" notices from scams that ask for the PIN required protective-phrase detection.

## What's next
Optional LLM deep analysis for unseen scam styles, a browser extension and Android SMS filter, community-reported patterns.

## Built with
JavaScript, HTML, CSS, GitHub Pages

## Links to add
- Live demo: https://<your-username>.github.io/<repo>/
- GitHub repo: https://github.com/<your-username>/<repo>
- Video: <YouTube/Drive link>

## 2-3 minute video script
1. (0:00) The problem: show a real-looking fake bKash SMS. "Millions get messages like this."
2. (0:20) Paste it into Sotorko → score 88, highlighted phrases, fake-link detection.
3. (0:50) Click the "wrong transfer" example → show explanation and the family warning copy button.
4. (1:20) Click a genuine transaction message → low risk (no false alarm).
5. (1:40) Quiz mode: answer one question, show the engine's explanation.
6. (2:10) Toggle to English. Mention privacy: no server, works offline. Close with roadmap.
