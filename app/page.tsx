import { WavePortfolio } from "@/components/experience/WavePortfolio";
import { getAbout, getPortfolio, getSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const url = absoluteUrl("/");
  return {
    title: { absolute: settings.seoTitle },
    description: settings.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      url,
      siteName: settings.siteName,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description: settings.seoDescription,
    },
  };
}

export default async function HomePage() {
  const [projects, settings, about] = await Promise.all([
    getPortfolio(),
    getSettings(),
    getAbout(),
  ]);
  return <WavePortfolio shopifyProjects={projects} settings={settings} about={about} />;
}
