# Reachout website (landing pages)

The public marketing site for Reachout: the landing page, contact page, privacy policy, terms and 404 page.
Plain HTML, CSS and a little JavaScript, with no framework and no build dependencies.

**What Reachout is:** one place for outreach and the job search. Users send personal email (and optionally
WhatsApp) messages from their own accounts, see who replied and what they want, track every job application
from their inbox, get scored job matches, and build their own one-page website. Everything they store is
encrypted, and sign-in uses one-time email codes.

| Repository | What | Hosted on |
|---|---|---|
| reachout-backend | Python API, background jobs, public user websites | Render |
| reachout-frontend | The React app (`/app`, `/login`, `/signup`) | Netlify |
| **reachout-web** (this one) | These public pages | Netlify |

## Pages

| File | URL | What's on it |
|---|---|---|
| `landing.html` | `/` | Hero, features, product tour, website builder demo, security, how it works, FAQ |
| `contact.html` | `/contact` | Contact form → Reachout's own enquiries (admins see them in Leads) |
| `privacy.html` | `/privacy` | Privacy policy |
| `terms.html` | `/terms` | Terms of use |
| `404.html` | any unknown URL | Not-found page |

`/login`, `/signup` and `/app` redirect to the app site.

## Project layout

```
*.html               The pages. {{SITE_URL}}, {{OPERATOR}} and {{JURISDICTION}} are filled in at build time
assets/
  style.css          Shared design tokens (light/dark), buttons, forms
  landing.css/.js    Landing page styles and behaviour (scroll reveals, product tour, theme preview, mobile menu)
  legal.css/.js      Privacy and terms pages
  common.js          Shared helpers: icons, theme, api(), form errors, toasts
  enquiry.js         Contact form + the "Have a question?" pop-up (posts to /api/leads)
  *.png, *.svg       Icons and the share image
netlify-build.mjs    Build: fills placeholders, adds robots.txt, sitemap.xml, _redirects and _headers (CSP)
netlify.toml         Netlify build + signed proxy of /api/* to the backend
```

## How it works

- The pages are static. The contact form and the pop-up post to `/api/leads`; Netlify forwards `/api/*` to the
  backend and signs each request with `NETLIFY_PROXY_SECRET`.
- The theme toggle saves the choice through `/api/prefs` (an HttpOnly cookie). Nothing is kept in
  localStorage.
- `netlify-build.mjs` computes SHA-256 hashes of the inline scripts for a strict Content-Security-Policy.
- SEO: canonical URLs, Open Graph/Twitter cards, JSON-LD (software, FAQ, organisation), sitemap and robots.

## Edit and preview locally

Edit the HTML/CSS/JS directly. To see the pages exactly as Netlify will serve them:

```bash
URL=http://localhost:8080 APP_URL=http://localhost:5173 node netlify-build.mjs
npx serve _site -l 8080        # or: python3 -m http.server 8080 -d _site
```

The contact form needs the backend running to actually send. When everything runs from one folder, the Python
server also serves these pages directly at `http://127.0.0.1:5050`.

## Deploy to Netlify

1. In `netlify.toml`, replace `reachout-api.onrender.com` with your Render address and `APP_URL` with your app
   site's address. Set `OPERATOR_NAME` (your name or company) and `JURISDICTION` for the legal pages. Commit.
2. Netlify → **Add new site → Import from Git** → this repository. Leave *Base directory* empty.
3. **Site configuration → Environment variables**: add `NETLIFY_PROXY_SECRET`, the same value as on Render.
4. **Change site name** (e.g. `reachout.netlify.app`) and make sure the backend's `LANDING_URL` and the app's
   `VITE_LANDING_URL` match it.
5. Check: the page loads, "Get started" opens the app's sign-up, and the contact form says "Thanks".

## Before launch

- Read `privacy.html` and `terms.html` and have them reviewed for your situation; they're a careful draft, not
  legal advice. When they change, update the "Last updated" date and bump `TERMS_VERSION` in the backend.
- The landing page's dashboard, names and numbers are illustrative sample content.
