import type { Metadata } from "next";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title === site.name ? title : `${title} — ${site.name}`;

  return {
    title: path === "/" ? { absolute: `${site.name} — ${site.tagline}` } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    alternateName: ["Lab13", "LAB×13", "Lab13 Design"],
    url: site.url,
    email: site.email,
    description: site.description,
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
    sameAs: [site.url],
    knowsAbout: [
      "Shopify",
      "Shopify Plus",
      "Shopify migrations",
      "Shopify app development",
      "Ecommerce development",
    ],
  };
}
