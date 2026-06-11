# Deployment (cPanel)

The site is a **static SPA** (Vite + TanStack Router) served directly by
Apache from `public_html`, plus a **small Express app** (`api/`) that handles
the contact form, running under cPanel's "Setup Node.js App" (Passenger,
Node 20.x).

Pages no longer need a Node server at all — only `/api/contact` does.

## How a deploy works

Every push to `main` (or a manual run of the workflow) does:

1. `vite build` with the public keys from GitHub secrets baked in.
2. Uploads `dist/` → `public_html` via FTP (mirror with delete, but
   **`.htaccess` is never touched**).
3. Uploads `api/` → `~/cabinet-api` (keeping the server-side
   `node_modules`, `.env` and `tmp/`).
4. Touches `cabinet-api/tmp/restart.txt`, which makes Passenger restart the
   API with the new code automatically.

No manual file copying after a deploy.

## One-time cPanel setup

1. **Clean up the old Next.js deployment**: remove the old Node app from
   "Setup Node.js App" and delete the old `/app` upload directory.
2. **Create the API app** in cPanel → *Setup Node.js App* → Create application:
   - Node.js version: 20.x
   - Application mode: Production
   - Application root: `cabinet-api`
   - Application URL: `<your-domain>/api`
   - Application startup file: `server.js`
3. **Set environment variables** in the same screen:
   - `EMAIL` — the Gmail address that sends/receives contact mails
   - `EMAIL_PASS` — its app password
   - `RECAPTCHA_SECRET_KEY` — the server-side reCAPTCHA key
4. Push to `main` once (or run the workflow manually) so `cabinet-api/` gets
   populated, then press **Run NPM Install** in the Node app screen.
   Repeat this button only when `api/package.json` changes.
5. **`.htaccess`**: when the app URL is `/api`, cPanel creates a physical
   `public_html/api/` directory whose `.htaccess` holds the
   `CLOUDLINUX PASSENGER CONFIGURATION` block — that directory is routing
   config, not leftovers; never delete it (the deploy workflow explicitly
   excludes it). Optionally merge `deploy/htaccess.example` into
   `public_html/.htaccess` (SPA fallback + asset caching).
   If `/api/*` ever returns a LiteSpeed 404 and the Node selector errors
   with `FileNotFoundError: .../public_html/api/.htaccess`, recreate that
   folder with an empty `.htaccess`, then Stop + Start the app to
   regenerate the block (see the post-mortem in
   docs/MIGRATION-WALKTHROUGH.md).
6. Verify: `https://<your-domain>/api/health` should return
   `{"status":"ok","email":"set","recaptcha":"set"}`.

## GitHub configuration

Secrets (Settings → Secrets and variables → Actions → Secrets):

| Secret | Purpose |
| --- | --- |
| `FTP_HOST` | FTP server hostname |
| `FTP_USERNAME` / `FTP_PASSWORD` | FTP account credentials |
| `GOOGLE_MAPS_API_KEY` | Public Maps key (baked into the bundle) |
| `RECAPTCHA_SITE_KEY` | Public reCAPTCHA site key (baked into the bundle) |

Optional repository **variables**, if your FTP account's root doesn't match
the defaults:

| Variable | Default | Meaning |
| --- | --- | --- |
| `FTP_SITE_DIR` | `/public_html` | Where `dist/` is uploaded |
| `FTP_API_DIR` | `/cabinet-api` | Where `api/` is uploaded |

The FTP account must be able to reach both directories. If your FTP account
is rooted at the cPanel home directory, the defaults are correct.

## Local development

```bash
cp .env.example .env.local        # fill in the two VITE_ keys
cp api/.env.example api/.env      # fill in EMAIL, EMAIL_PASS, RECAPTCHA_SECRET_KEY
npm install && npm --prefix api install
npm run dev:api                   # contact API on :3001
npm run dev                       # site on :5173, /api proxied to :3001
```
