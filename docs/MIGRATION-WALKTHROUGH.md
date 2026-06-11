# From Next.js to a static SPA: full migration walkthrough

This document explains everything that was done to this project in June 2026,
and more importantly **why** — so it can serve as a learning reference.

The work had four phases:

1. [Porting from Next.js to Vite + TanStack Router](#1-the-port)
2. [Extracting the contact API into a standalone Express app](#2-the-contact-api)
3. [Auditing and fixing the design](#3-the-design-audit)
4. [Rebuilding the cPanel deployment](#4-the-deployment) (and debugging it live)

---

## 0. The starting point and the core decision

The site was a **single page** (hero + 4 sections) built on Next.js App
Router, with exactly one piece of server logic: a contact form endpoint that
verifies reCAPTCHA and sends two emails. Yet to deploy it, a full Node.js
server had to run on shared cPanel hosting, fronted by an `.htaccess` that
proxied every request to `127.0.0.1:3000`. Deploys regularly broke and
required copying files by hand.

**The key insight:** this site didn't need a server for its pages at all.
Server-side rendering (what Next.js provides) earns its complexity when you
have many pages, dynamic per-request content, or strict SEO needs across
deep URLs. A one-page brochure site has none of those. So the architecture
chosen was:

```
Before:                              After:
┌─────────────────────────┐          ┌──────────────────────────┐
│ Apache (.htaccess proxy) │          │ Apache/LiteSpeed          │
│   └─> Node server :3000  │          │   ├─ /            → static files (dist/)
│        └─> Next.js SSR   │          │   └─ /api/*       → Passenger → Express
│             ├─ pages     │          │                      (contact form only)
│             └─ /api      │          └──────────────────────────┘
└─────────────────────────┘
```

Static files can't crash, don't need restarts, and deploy by simple upload.
The only process that can fail is now a ~150-line Express app.

**Lesson:** before porting a stack, ask what the runtime actually does for
you. The biggest win here wasn't TanStack vs Next — it was deleting the
requirement for a page server entirely.

---

## 1. The port

### Inventory first

Before touching anything, the code was searched for everything
Next.js-specific. The surface turned out to be tiny:

| Next.js feature | Where | Replacement |
| --- | --- | --- |
| `next/link` | `ScrollLink.jsx` | plain `<a>` (it only smooth-scrolled to anchors anyway) |
| `next/image` | `Galerie.jsx` | plain `<img loading="lazy">` with URLs from `public/` |
| `next/script` | `layout.jsx` | deleted entirely (see env vars below) |
| `NextResponse` API route | `app/api/contact/route.js` | Express app (phase 2) |
| App Router layout/page | `app/layout.jsx`, `app/page.jsx` | `src/main.jsx` (router) + `src/Home.jsx` |
| `'use client'` directives | most components | deleted — meaningless outside React Server Components |

The same search revealed that `mongoose`, `mongodb`, `next-auth`, `bcrypt`,
`sharp`, `uuid`, `body-parser` and the whole Babel toolchain were **never
imported anywhere**. They were deleted. Unused dependencies aren't just
bloat — they're what Dependabot keeps filing security PRs about.

**Lesson:** `grep` for the framework's import paths before estimating a
migration. "Port away from Next.js" sounded big; the real coupling was six
files.

### TanStack Router setup

For a single route, TanStack Router's *code-based* API is enough — no
file-based routing plugin, no generated route tree:

```jsx
const rootRoute = createRootRoute({
    component: () => (
        <>
            {/* background, Nav, Footer — the old layout.jsx */}
            <main className="app">
                <Nav />
                <Outlet />   {/* the matched route renders here */}
                <Footer />
            </main>
        </>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
});

const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]) });
```

The root route plays the role of Next's `layout.jsx`; `<Outlet />` is the
equivalent of `{children}`.

### Environment variables: the build-time model

The old setup had **three** mechanisms for getting two public API keys to
the browser: `NEXT_PUBLIC_*` env vars, a `runtime-config.js` script that set
`window._env`, and fallback code that tried both. That existed because the
team didn't trust env vars to survive the cPanel deploy.

With Vite the model is simpler and deterministic: any `VITE_*` variable is
**baked into the JavaScript bundle as a literal string at build time**
(`import.meta.env.VITE_GOOGLE_MAPS_API_KEY`). Since the build happens in
GitHub Actions where the secrets demonstrably exist, there is nothing left
to go wrong at runtime — so the whole `window._env` indirection was deleted.

Naming convention after the port:

| Variable | Where it lives | Visibility |
| --- | --- | --- |
| `VITE_GOOGLE_MAPS_API_KEY` | baked into bundle by CI | public by design |
| `VITE_RECAPTCHA_SITE_KEY` | baked into bundle by CI | public by design |
| `EMAIL`, `EMAIL_PASS`, `RECAPTCHA_SECRET_KEY` | cPanel Node app env vars | secret, server-only |

Note the old name `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY` was a misnomer worth
fixing: the *secret* key was named as if it were public. `NEXT_PUBLIC_`/
`VITE_` prefixes are a contract — anything carrying them ships to every
visitor's browser. Secrets must never have them.

### Mechanical gotchas worth remembering

- **`"type": "module"`** in `package.json` makes Node treat `.js` files as
  ES modules — so `tailwind.config.js` and `postcss.config.js` had to switch
  from `module.exports =` to `export default`.
- **Path aliases** (`@components/...`, `@/...`) moved from `jsconfig.json`
  (a Next/TS convention) to `resolve.alias` in `vite.config.js`.
- **You can't `import` files from `public/`** in Vite. Next allowed static
  imports of images; in Vite, `public/` files are referenced by URL string
  (`/assets/images/cabinet/1.jpg`). Files that need hashing/processing would
  go into `src/assets` instead, but a photo gallery is fine as plain URLs.
- The **dev proxy** (`server.proxy: { '/api': 'http://localhost:3001' }`)
  recreates in development the same-origin `/api` setup production has, so
  the form code needs no environment-specific URL.

---

## 2. The contact API

The Next.js route handler became `api/server.js` — a self-contained Express
app with its own `package.json`, deliberately **minimal** (express,
nodemailer, dotenv) because every dependency must install and run on the
shared host's Node 20.14, which cannot be upgraded.

Design choices to note:

- **`axios` was dropped** in favor of Node's built-in `fetch` for the
  reCAPTCHA verification call — one less dependency on the server.
- **Routes registered under both paths**:
  `app.post(['/contact', '/api/contact'], ...)`. Depending on how Passenger
  is configured, the `/api` mount prefix may or may not be stripped from the
  URL the app sees. Accepting both costs nothing and removes a whole class
  of "404 in production only" surprises.
- **A `/health` endpoint** that reports whether each env var is set (without
  leaking values):

  ```json
  {"status":"ok","email":"set","recaptcha":"set"}
  ```

  This turned out to be the single most useful debugging tool during
  go-live — one URL distinguishes "app not running" from "app running but
  misconfigured".
- **The confirmation email failure is non-fatal** (caught and logged): if
  mail to the visitor fails, the clinic still gets the request, which is the
  email that matters. This mirrors the original code's behavior.

**Lesson:** when extracting server code to a constrained host, optimize for
diagnosability (health checks, explicit logs) and minimal dependencies, not
elegance.

---

## 3. The design audit

### Method

Instead of eyeballing the site, a small script (`scripts/shoot.mjs`) drives
the locally installed Chrome via `playwright-core` (the `-core` package
skips downloading a browser), screenshots every section at **1280px and
390px**, and reports any browser console errors. Run it anytime with
`node scripts/shoot.mjs` (or against production:
`SHOT_URL=https://smilevillage.ro/ node scripts/shoot.mjs`).

Screenshots before/after each change make regressions visible immediately —
the same script later verified the production deploy.

### What was found (and the general principle behind each)

1. **`btn-outline` didn't exist.** The hero's "Programare" button referenced
   a CSS class that was never defined, so it rendered as bare text.
   Similarly `text-textColor-primary` in the nav matched nothing in the
   Tailwind config. *Principle: with utility-class systems, a typo'd or
   undefined class fails silently — there's no error, the style is just
   absent. Visual review or a linter is the only way to catch it.*
2. **`-translate-x-1/2` without `left-1/2`.** The "Descoperă mai mult"
   scroll hint was being shifted left by half its width… relative to the
   wrong starting position. The pair `left-1/2 -translate-x-1/2` is the
   standard centering idiom — half of it does nothing useful.
3. **White nav text over a light hero.** The initial (unscrolled) navbar
   used white links on a near-white background — invisible. The fix kept
   the two-state design but made both states dark-text-on-light.
   *Principle: check contrast in every state, not just the default one.*
4. **Justified text on mobile.** `text-justify` in 390px-wide columns
   produced huge gaps between words (Romanian's long words make it worse).
   Justification needs wide lines; on mobile use left-aligned text.
5. **Inconsistent structure.** "Despre noi" was the only section without a
   heading; Contact had a second `<h1>` (a page gets one `<h1>`; the rest
   are `h2`/`h3` — this matters for SEO and screen readers).
6. **Copy that referenced layout.** "Sună-ne! ↑ … iconița →" used arrows
   pointing at elements whose position changes per breakpoint — on mobile
   the arrows pointed at nothing. Copy should never encode geometry.
7. **Details:** lime-colored `<hr>`s clashing with the green theme, a map
   hard-coded to 320×320 inside a half-width column, footer logos pinned
   left without wrapping, unbalanced Romanian quotes („…" needs both
   halves), and a typo (*clinicele* → *clinicile*).

---

## 4. The deployment

### Why the old pipeline needed manual fixes

The old GitHub Action generated `server.js`, `next.config.js`, `.env.local`
and `.htaccess` **inside the workflow** (so the repo didn't even contain
what actually ran), built Next.js, and FTP-mirrored *everything* — source,
build output, configs — to one folder. The Node app then had to be manually
wired in cPanel, and each full mirror could overwrite server-side state
(like the `.htaccess` that routes to the Node app), undoing the manual
wiring. Hence: every deploy needed hand-copying to repair.

### The new workflow (`.github/workflows/deploy.yml`)

1. `npm ci && vite build` — with the two public keys injected from GitHub
   secrets as `VITE_*` env vars.
2. `lftp mirror -R --delete dist/ /public_html` — uploads **only the build
   output**, deleting remote files that no longer exist locally, **but
   excluding `.htaccess`** (see below).
3. `lftp mirror -R --delete api/ /cabinet-api` — uploads the API source,
   excluding `node_modules`, `.env` and `tmp/`, which live only on the
   server.
4. Uploads a fresh `tmp/restart.txt` into the API directory — **touching
   this file is Passenger's official "restart the app" signal**, so new API
   code goes live with no cPanel clicking.

Target paths are overridable via repo *variables* (`FTP_SITE_DIR`,
`FTP_API_DIR`) so a different FTP layout never requires editing the
workflow.

### The `.htaccess` rule — the heart of the fix

On CloudLinux/cPanel hosting, "Setup Node.js App" works by writing a block
into the **document root's `.htaccess`**:

```apache
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/smilevil/cabinet-api"
PassengerBaseURI "/api"
PassengerNodejs "/home/smilevil/nodevenv/cabinet-api/20/bin/node"
...
```

That block **is** the routing for `/api`. If CI ever mirrors over
`.htaccess`, the API silently dies until someone restores it by hand — this
is almost certainly what the old "copy files manually after each deploy"
ritual was repairing. The new workflow therefore treats `.htaccess` as
server-owned state and never uploads or deletes it.

**Lesson:** in any deploy pipeline, list which files are owned by CI and
which are owned by the server, and make the pipeline physically incapable of
touching the server-owned ones.

### Go-live debugging (a worked example)

What actually happened when the first deploy went out, in order:

1. Site loaded the new build ✅ but `/api/health` returned the **old
   Next.js 404 page** → the old `.htaccess` proxy
   (`RewriteRule ... 127.0.0.1:3000 [P]`) was still routing `/api` to the
   old, still-running server. *Diagnosis came from recognizing the response
   body — a Next error page means a Next server is still answering.*
2. After the Node app was created: `/api/health` returned a **LiteSpeed
   503**. Reading the pasted `.htaccess` revealed
   `PassengerBaseURI "/"` — the app had been registered at the domain root
   instead of `/api`, so Passenger was intercepting every non-file request
   with an app that hadn't started yet. Fix: set Application URL to `api`
   and run **NPM Install** (Passenger can't boot the app before its
   dependencies exist).
3. Then `/api/health` returned `{"status":"ok",...}`, and a POST to
   `/api/contact` without a captcha returned `{"error":"Missing
   recaptchaValue"}` — proving the entire chain
   (LiteSpeed → Passenger → Express → validation) without sending email.
4. The final "bug" — the visitor's confirmation email missing — was
   diagnosed by checking the Gmail **Sent** folder: the mail was there, so
   it was a deliverability (spam) issue, not a code issue. Automated mail
   from a bare `@gmail.com` account often lands in spam; the durable fix is
   sending from a domain mailbox (`contact@smilevillage.ro`) through the
   host's SMTP, which carries the domain's SPF/DKIM.

**Lesson:** each step used the cheapest possible probe that could split the
remaining hypotheses in two (response *body* not just status code; health
endpoint; Sent folder). That's faster than changing things and hoping.

---

## 5. Operations cheat-sheet (day 2)

| Task | How |
| --- | --- |
| Deploy | push/merge to `main` — that's it |
| Local dev | `npm run dev:api` + `npm run dev` (see README) |
| Visual check | `node scripts/shoot.mjs` (add `SHOT_URL=...` for prod) |
| Is the API alive/configured? | https://smilevillage.ro/api/health |
| Changed `api/package.json` | after deploy, press **Run NPM Install** once in cPanel |
| Change public keys (Maps/reCAPTCHA site) | update GitHub secret, re-run the workflow |
| Change email creds / reCAPTCHA secret | update env vars in cPanel → Setup Node.js App → restart app |
| API logs | `cabinet-api/stderr.log` via File Manager |
