// One-off: moves current hard-coded content into Keystatic files.
// Run with: node scripts/migrate-content.mjs
import { createJiti } from "jiti";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const jiti = createJiti(import.meta.url, { alias: { "@": root } });
const { projects } = await jiti.import(path.join(root, "content/projects.ts"));
const { studio } = await jiti.import(path.join(root, "content/studio.ts"));
const { site } = await jiti.import(path.join(root, "lib/site.ts"));

const pub = (p) => path.join(root, "public", p.replace(/^\//, ""));
const moves = new Map(); // source public path -> Set of destinations

function place(src, destPublic) {
  if (!fs.existsSync(pub(src))) throw new Error(`Missing ${src}`);
  if (!moves.has(src)) moves.set(src, new Set());
  moves.get(src).add(destPublic);
  return destPublic;
}

const ext = (p) => path.extname(p);
const videos = {
  "bowflex-uk": "/videos/bowflex.mp4",
  maeving: "/videos/maeving.mp4",
  "hylo-athletics": "/videos/hylo.mp4",
};
const plus = new Set(["bowflex-uk", "hylo-athletics", "maeving"]);
const tones = { moss: "#1c3428", steel: "#243038", cashmere: "#b7a898", ink: "#161614", sand: "#c2b39f" };

const portfolioDir = path.join(root, "content/portfolio");
fs.mkdirSync(portfolioDir, { recursive: true });

let order = 0;
for (const p of projects) {
  order += 10;
  const shopify = p.category === "shopify";
  const base = `/images/portfolio/${p.slug}`;
  const entry = {
    title: p.title,
    featured: Boolean(p.featured && shopify),
    order,
    plus: plus.has(p.slug),
    client: p.client,
    industry: p.industry,
  };

  if (shopify) {
    const card = `/images/projects/previews/${p.slug}-card.jpg`;
    entry.cardImage = place(card, `${base}/cardImage${ext(card)}`);
  }
  if (videos[p.slug]) {
    entry.cardVideo = place(videos[p.slug], `/videos/portfolio/${p.slug}/cardVideo.mp4`);
  }
  entry.tone = p.hero.kind === "field" ? tones[p.hero.tone] : "#1a1916";
  if (p.liveUrl) entry.liveUrl = p.liveUrl;
  if (p.liveShot) entry.liveShot = place(p.liveShot, `${base}/liveShot${ext(p.liveShot)}`);

  const frameSrcs = [];
  if (p.hero.kind === "image") frameSrcs.push(p.hero.src);
  for (const g of p.gallery) if (g.kind === "image" && !frameSrcs.includes(g.src)) frameSrcs.push(g.src);
  if (frameSrcs.length === 0 && shopify) frameSrcs.push(`/images/projects/previews/${p.slug}-full.jpg`);
  entry.frames = frameSrcs.map((src, i) => place(src, `${base}/frames/${i}${ext(src)}`));

  Object.assign(entry, {
    intro: p.intro,
    services: p.services,
    overview: p.overview,
    challenge: p.challenge,
    solution: p.solution,
    development: p.development,
    results: p.results ?? [],
    quote: { text: p.quote?.text ?? "", attribution: p.quote?.attribution ?? "" },
    technologies: p.technologies,
  });

  fs.writeFileSync(
    path.join(portfolioDir, `${p.slug}.yaml`),
    yaml.dump(entry, { lineWidth: 80, noRefs: true }),
  );
}

// Team portraits
const portraits = {
  "Joshua Corby": "/images/studio/joshua-corby.jpg",
  "Hayden Corby": "/images/studio/hayden-corby.jpg",
};
const about = {
  about: studio.about,
  people: studio.people.map((person) => {
    const src = portraits[person.name];
    return {
      name: person.name,
      role: person.role,
      ...(src ? { portrait: place(src, `/images/team/${path.basename(src)}`) } : {}),
    };
  }),
};

const settings = {
  siteName: site.name,
  wordmark: site.shortName,
  email: site.email,
  tagline: "We know Shopify",
  aboutLabel: "About",
  contactLabel: "Contact",
  contactHeading: "Get in touch",
  seoTitle: `${site.name} — Shopify Plus studio in Exeter`,
  seoDescription: site.description,
};

const loader = { enabled: true, duration: 2.8, hold: 0.7, lines: 22, brightness: 1, label: "Loading" };

const json = (file, data) =>
  fs.writeFileSync(path.join(root, "content", file), JSON.stringify(data, null, 2) + "\n");
json("about.json", about);
json("settings.json", settings);
json("loader.json", loader);

// Copy media into place. Originals are left untouched — remove them yourself
// once you've checked the site, if you want to.
for (const [src, dests] of moves) {
  for (const dest of dests) {
    fs.mkdirSync(path.dirname(pub(dest)), { recursive: true });
    fs.copyFileSync(pub(src), pub(dest));
  }
}

console.log(`Migrated ${projects.length} projects, copied ${moves.size} media files.`);
console.log("Originals left in place:");
for (const src of moves.keys()) console.log(`  public${src}`);
