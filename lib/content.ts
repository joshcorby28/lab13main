import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

/**
 * Reads CMS content from the repo at build/render time.
 * With Keystatic Cloud, edits are committed to GitHub and Vercel rebuilds,
 * so reading local files here is always up to date in production.
 */
const reader = createReader(process.cwd(), keystaticConfig);

export type PortfolioItem = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  intro: string;
  services: string[];
  technologies: string[];
  liveUrl?: string;
  liveShot?: string;
  card: string;
  cardVideo?: string;
  frames: string[];
  tone: string;
  overview: string;
  challenge: string;
  solution: string;
  development: string;
  results?: string[];
  quote?: { text: string; attribution: string };
  plus?: boolean;
};

export type SiteSettings = {
  siteName: string;
  wordmark: string;
  email: string;
  tagline: string;
  aboutLabel: string;
  contactLabel: string;
  contactHeading: string;
  seoTitle: string;
  seoDescription: string;
};

export type AboutContent = {
  about: string;
  people: Array<{ name: string; role: string; portrait?: string }>;
};

export type LoaderSettings = {
  enabled: boolean;
  duration: number;
  hold: number;
  lines: number;
  brightness: number;
  label: string;
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Lab 13",
  wordmark: "LAB×13",
  email: "info@lab-13.co.uk",
  tagline: "We know Shopify",
  aboutLabel: "About",
  contactLabel: "Contact",
  contactHeading: "Get in touch",
  seoTitle: "Lab 13 — Shopify Plus studio in Exeter",
  seoDescription:
    "Family-run Shopify Plus studio in Exeter. We design and build Shopify stores, migrations and custom apps for brands in the UK and worldwide.",
};

const DEFAULT_LOADER: LoaderSettings = {
  enabled: true,
  duration: 2.8,
  hold: 0.7,
  lines: 22,
  brightness: 1,
  label: "Loading",
};

const clean = (value: string | null | undefined) => (value ?? "").trim();
const nonEmpty = (list: readonly string[]) => list.map((item) => item.trim()).filter(Boolean);

export const getPortfolio = cache(async (): Promise<PortfolioItem[]> => {
  const entries = await reader.collections.portfolio.all();
  return entries
    .filter(({ entry }) => entry.featured)
    .sort((a, b) => (a.entry.order ?? 100) - (b.entry.order ?? 100) || a.slug.localeCompare(b.slug))
    .map(({ slug, entry }) => {
      const quoteText = clean(entry.quote.text);
      const results = nonEmpty(entry.results);
      return {
        slug,
        title: entry.title,
        client: clean(entry.client),
        industry: clean(entry.industry),
        intro: clean(entry.intro),
        services: nonEmpty(entry.services),
        technologies: nonEmpty(entry.technologies),
        liveUrl: entry.liveUrl || undefined,
        liveShot: entry.liveShot || undefined,
        card: entry.cardImage ?? "",
        cardVideo: entry.cardVideo || undefined,
        frames: entry.frames.filter((frame): frame is string => Boolean(frame)),
        tone: /^#[0-9a-f]{3,8}$/i.test(clean(entry.tone)) ? clean(entry.tone) : "#1a1916",
        overview: clean(entry.overview),
        challenge: clean(entry.challenge),
        solution: clean(entry.solution),
        development: clean(entry.development),
        results: results.length ? results : undefined,
        quote: quoteText
          ? { text: quoteText, attribution: clean(entry.quote.attribution) }
          : undefined,
        plus: entry.plus,
      };
    });
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const data = await reader.singletons.settings.read();
  if (!data) return DEFAULT_SETTINGS;
  const pick = (key: keyof SiteSettings) => clean(data[key]) || DEFAULT_SETTINGS[key];
  return {
    siteName: pick("siteName"),
    wordmark: pick("wordmark"),
    email: pick("email"),
    tagline: pick("tagline"),
    aboutLabel: pick("aboutLabel"),
    contactLabel: pick("contactLabel"),
    contactHeading: pick("contactHeading"),
    seoTitle: pick("seoTitle"),
    seoDescription: pick("seoDescription"),
  };
});

export const getAbout = cache(async (): Promise<AboutContent> => {
  const data = await reader.singletons.about.read();
  return {
    about: clean(data?.about),
    people: (data?.people ?? [])
      .filter((person) => clean(person.name))
      .map((person) => ({
        name: clean(person.name),
        role: clean(person.role),
        portrait: person.portrait || undefined,
      })),
  };
});

const clamp = (value: number | null | undefined, min: number, max: number, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export const getLoaderSettings = cache(async (): Promise<LoaderSettings> => {
  const data = await reader.singletons.loader.read();
  if (!data) return DEFAULT_LOADER;
  return {
    enabled: data.enabled,
    duration: clamp(data.duration, 0.5, 10, DEFAULT_LOADER.duration),
    hold: clamp(data.hold, 0, 5, DEFAULT_LOADER.hold),
    lines: Math.round(clamp(data.lines, 4, 60, DEFAULT_LOADER.lines)),
    brightness: clamp(data.brightness, 0.2, 2, DEFAULT_LOADER.brightness),
    label: clean(data.label),
  };
});
