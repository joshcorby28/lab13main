# Lab 13

A custom agency website for **Lab 13**, an independent Shopify / Shopify Plus studio.

The site is original. Visual pacing, typography and interaction take cues from premium digital studios (notably [Unseen](https://unseen.co/)), while copy, services, projects and contact details come from the existing [Lab 13](https://lab-13.co.uk/) site. It is not a clone of either.

## Stack

- Next.js 16 (App Router)
- TypeScript
- React 19
- Tailwind CSS 4
- Motion (`motion/react`) for restrained animation

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Purpose                |
| --------------- | ---------------------- |
| `npm run dev`   | Development server     |
| `npm run build` | Production build       |
| `npm run start` | Serve the production build |
| `npm run lint`  | ESLint                 |

## Deployment

The project is a standard Next.js app. Deploy on Vercel, Netlify, or any Node host that supports `next build` + `next start`. Set the canonical domain to **lab-13.co.uk**.

The contact form is UI-only. Wire `components/contact/ContactForm.tsx` to an API route, form service or email provider when you are ready.

## Project structure

```text
app/                 Routes, metadata, sitemap, robots
components/
  navigation/        Header + mobile menu
  footer/
  hero/
  projects/          Editorial work list + media
  services/
  animations/
  ui/                Cursor, buttons, container
content/             Data-driven projects and services
lib/                 Site config, SEO helpers
public/images/       Brand and project imagery
```

## Content

Project facts, results and quotes are taken from Lab 13’s published case studies. Results are only shown where Lab 13 already states them.

## License

Private project for Lab 13.
