# Setup

## Requirements

- Node.js **20+**
- npm (comes with Node)
- A code editor (Cursor, VS Code, etc.)

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

| What | Where |
|------|--------|
| Projects / case studies | `content/portfolio/*.yaml` (or `/admin`) |
| Studio / About copy | `content/about.json` (or `/admin`) |
| Site name, email, URL, SEO | `content/settings.json` (or `/admin`) |
| Loader speed, lines, brightness | `content/loader.json` (or `/admin`) |
| Services | `content/services.ts` |
| Project images | `public/images/portfolio/<slug>/` |
| Audio (Track of the Day) | `public/audio/` |

Homepage portfolio cards are mapped in `app/page.tsx` (`toWaveProject`).

## Build for production

```bash
npm run build
npm run start
```

## Deploy on Vercel

1. Push the project to GitHub (or import the folder in Vercel).
2. Create a new Vercel project from that repo.
3. Framework preset: **Next.js** (auto-detected).
4. Deploy.
5. Add your custom domain under **Settings → Domains**.

No special environment variables are required for the default portfolio experience.

## CMS (Keystatic) — editing without code

The site ships with a CMS at `/admin` (redirects to `/keystatic`). Editors can add, edit and
reorder portfolio projects, change site text, the About copy and team, and the loader settings.

### Editing locally

Run `npm run dev` and open [http://localhost:3000/admin](http://localhost:3000/admin). Changes are
written straight to the files in this repo. Commit and push them to publish.

### Editing on the live site (Keystatic Cloud)

The live site can't save to its own files, so it uses Keystatic Cloud, which commits each change
to GitHub and triggers a Vercel redeploy (about 1–2 minutes).

One-time setup, by whoever manages the site:

1. Create a project at [keystatic.cloud](https://keystatic.cloud) and connect it to the
   `joshcorby28/lab13main` GitHub repo.
2. In Vercel → Settings → Environment Variables, add `NEXT_PUBLIC_KEYSTATIC_PROJECT` with the
   value `lab13/lab13main` (the project name shown in Keystatic Cloud).
3. Redeploy. `/admin` then becomes the editor; editors sign in with their Keystatic Cloud account.

Until step 2 is done, `/admin` on the live site shows setup instructions instead of a broken editor.

### Support

This is a coded template, not a hosted product. You’re expected to be comfortable with React / Next.js basics. Include your purchase email if you contact the seller about setup issues covered in this file.
