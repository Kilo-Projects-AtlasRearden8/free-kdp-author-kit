# STATUS

## What was built

A static, client-side freebies guide/directory of free Kindle Direct Publishing (KDP) resources for authors, built in `/workspace/kilo-lab/free-kdp-author-kit`:

- `README.md` — warm, plain-English guide; audience (Dylan Asdale, registered nurse turned AI author, founder of Asdale Dynamics, LLC), the four resource categories, how to use, official-links policy, credit to Asdale Dynamics, LLC, license
- `LICENSE` — MIT License, copyright line exactly `Copyright (c) 2026 Asdale Dynamics, LLC`
- `resources.json` — 10 curated official free resources across four categories: Cover templates (3), Blurb writers (2), Category pickers (2), Royalty calculators (3). Each entry has id, title, category, description, tags, HTTPS URL, source, `whatYouCanDo`, and official/cost flags
- `index.html` — static site shell; credits Asdale Dynamics, LLC and Dylan Asdale / *The Massive AI Manual*; links CSS and JS
- `style.css` — responsive card layout, category filter chips, search box styling
- `app.js` — vanilla JavaScript: fetches `resources.json`, client-side search by title/category/description/tags/source/whatYouCanDo, category filter chips, result count, empty state, opens official links in a new tab with `noopener noreferrer`
- `validate.js` — verification script (113 checks)
- `STATUS.md` — this file

Every link points to an official Amazon/KDP domain (`amazon.com`, `kdp.amazon.com`, `authorcentral.amazon.com`, `kindlecreate.amazon.com`) over HTTPS. No affiliate links, no paid tools, no third-party directories. No `.github/workflows` files. No secrets, API keys, or personal data in any file.

## How to run

Open `index.html` in any modern browser:

```
cd /workspace/kilo-lab/free-kdp-author-kit
# option 1: open directly (works, but use a local server for fetch())
open index.html   # macOS / xdg-open on Linux

# option 2: local server (recommended so fetch() works without CORS restrictions)
python3 -m http.server 8000
# then visit http://localhost:8000/index.html
```

Type in the search box to filter resources; click a category chip to filter by category. Works offline after load except for the official links themselves.

## Verification results

- `node validate.js`: 113 checks, 0 failures
  - All required files present
  - `LICENSE` contains the exact copyright line `Copyright (c) 2026 Asdale Dynamics, LLC`, occurring once
  - README and site credit Asdale Dynamics, LLC (and Dylan Asdale / *The Massive AI Manual*)
  - `resources.json` is valid JSON; all 10 entries have id, title, valid category, description, tags, HTTPS URL, source, and `whatYouCanDo`
  - All URLs are official Amazon/KDP domains over HTTPS
  - `index.html` links `style.css` and `app.js`; `app.js` loads `resources.json`
  - Client-side search/filter code present
  - No secrets or keys detected; no `.github` directory
- Simulated search/filter logic in Node: royalty search returns 3 resources, cover returns 3, blurb returns 2, category returns 2, zero-match case handled; every resource has an actionable `whatYouCanDo` line

## Known gaps

- Resource URLs point to official KDP help-center/category landing pages rather than deep-linked tool pages, because exact deep-link topic IDs were not independently confirmed and only official links are permitted; descriptions explain what to do once on each page.
- No built-in royalty calculator form — the directory links to official KDP royalty guidance instead, per the "official links only" requirement.
- No automated accessibility or cross-browser testing; manually verified structure only.
- No CI/CD (no `.github/workflows` by design).
- Git initialized locally only; no remote, no push (by design).
