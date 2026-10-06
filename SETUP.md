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
| Projects / case studies | `content/projects.ts` |
| Studio / About copy | `content/studio.ts` |
| Site name, email, URL | `lib/site.ts` |
| Services | `content/services.ts` |
| Project images | `public/images/projects/` |
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

## Optional: Keystatic CMS

This project includes Keystatic for content editing. For a simple template install you can ignore it and edit the TypeScript/YAML content files directly.

## Support

This is a coded template, not a hosted product. You’re expected to be comfortable with React / Next.js basics. Include your purchase email if you contact the seller about setup issues covered in this file.
