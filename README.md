# Bansko Apartments – Gallery + Admin Texts
- WhatsApp contact per apartment (includes apt name + page link)
- Admin login (password hashed) to:
  - Edit apartments and download updated `apartments.json`
  - Edit site texts and download updated `site.json`

## Deploy (Netlify)
1. Upload these files to GitHub → Netlify Import from Git
2. Build command: `npm run build` ; Publish directory: `dist`

## Change Admin Password
1. Open `/admin-hash.html` on the deployed site.
2. Enter a new passphrase → copy the SHA-256 hex.
3. Replace `ADMIN_PASS_HASH` in `src/App.jsx` with the new hex → commit → redeploy.

## Add Photos
- Upload to `public/photos` in GitHub and reference them in `public/apartments.json`.
