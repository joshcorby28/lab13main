export const site = {
  name: "Lab 13",
  legalName: "Lab13",
  shortName: "LAB×13",
  domain: "https://lab-13.co.uk",
  url: "https://lab-13.co.uk",
  email: "info@lab-13.co.uk",
  locale: "en_GB",
  description:
    "A small family-run studio designing and developing thoughtfully crafted Shopify Plus stores, custom Shopify apps, migrations and retainers.",
  tagline: "Thoughtfully crafted Shopify Plus stores & apps.",
  location: "United Kingdom",
  acceptingClients: true,
} as const;

export const nav = [
  { href: "/", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
