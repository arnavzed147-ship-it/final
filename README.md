# Artan Protec — Netlify‑ready React Site (Vite + Tailwind)

This repo is a dedicated Artan Protec site with product dropdowns, detailed specs, and a Netlify Form that sends submissions to your configured email via Netlify notifications.

## Stack
- React + Vite
- TailwindCSS
- lucide-react icons
- Netlify Forms (no server code)

## Local dev
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
```

## Netlify Forms (who gets the email?)
By default, the contact form is a **Netlify Form**. In your Netlify dashboard:
1. Deploy the site once.
2. Go to **Forms → contact → Notifications**.
3. Add an **Email notification** to: `artanprotec@gmail.com` (or any address you prefer).

You can export submissions as CSV and add webhooks/Slack too.

## Deploy to Netlify from GitHub
1. Create a new GitHub repository and push this folder.
2. On Netlify, click **Add new site → Import from Git**.
3. Pick your repo. Netlify will auto-detect:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy.

## Manual Deploy (zip upload)
1. `npm run build`
2. Drag the `dist/` folder to **Site Deploys** in Netlify. (Netlify CLI also works.)

## Brand assets
Place your logos at:
- `/public/artan-protec-logo.png`
- `/public/artan-protec-logo-mark.png`

Brochures (activate download buttons by adding PDFs):
- `/public/brochures/artan-corethread.pdf`
- `/public/brochures/artan-armorweave.pdf`
- `/public/brochures/artan-ppe.pdf`
