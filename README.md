# SmileVillage — Cabinet Stomatologic Dr. Roxana Dancea

Single-page presentation site for a dental practice in Traian Vuia, Timiș.

## Stack

- **Site**: React 18 + [TanStack Router](https://tanstack.com/router) +
  [Vite](https://vite.dev), Tailwind CSS, MUI. Builds to plain static files
  (`dist/`) — no server required to serve pages.
- **Contact API** (`api/`): small Express app (reCAPTCHA verification +
  Nodemailer), runs on Node 20. Reached at `/api/contact`.

## Development

```bash
cp .env.example .env.local        # VITE_GOOGLE_MAPS_API_KEY, VITE_RECAPTCHA_SITE_KEY
cp api/.env.example api/.env      # EMAIL, EMAIL_PASS, RECAPTCHA_SECRET_KEY
npm install && npm --prefix api install

npm run dev:api    # contact API on http://localhost:3001
npm run dev        # site on http://localhost:5173 (proxies /api to :3001)
```

`npm run build` produces the production site in `dist/`.

## Deployment

Pushing to `main` deploys automatically to cPanel via FTP (static files to
`public_html`, API to the cPanel Node app). See [DEPLOYMENT.md](DEPLOYMENT.md)
for the one-time cPanel setup and the GitHub secrets involved.
