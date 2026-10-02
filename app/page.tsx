import { WavePortfolio, type WaveProject } from "@/components/experience/WavePortfolio";
import { getFeaturedProjects, type Project } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lab 13",
  description:
    "A small family-run studio designing and developing thoughtfully crafted Shopify Plus stores, custom apps and migrations.",
  path: "/",
});

const tones: Record<string, string> = {
  moss: "#1c3428",
  steel: "#243038",
  cashmere: "#b7a898",
  ink: "#161614",
  sand: "#c2b39f",
};

function toWaveProject(project: Project): WaveProject {
  const frames: string[] = [];
  const push = (src?: string) => {
    if (src && !frames.includes(src)) frames.push(src);
  };

  if (project.hero.kind === "image") push(project.hero.src);
  for (const item of project.gallery) {
    if (item.kind === "image") push(item.src);
  }
  push(`/images/projects/previews/${project.slug}-full.jpg`);
  push(`/images/projects/previews/${project.slug}-card.jpg`);

  const hasPreviewCard = project.category === "shopify";
  const tone = project.hero.kind === "field" ? tones[project.hero.tone] : "#1a1916";

  return {
    slug: project.slug,
    title: project.title,
    client: project.client,
    industry: project.industry,
    summary: project.summary,
    services: project.services,
    liveUrl: project.liveUrl,
    card: hasPreviewCard
      ? `/images/projects/previews/${project.slug}-card.jpg`
      : "",
    cardVideo:
      project.slug === "maeving"
        ? "/videos/maeving.mp4"
        : project.slug === "hylo-athletics"
          ? "/videos/hylo.mp4"
          : undefined,
    frames:
      frames.length > 0
        ? frames
        : hasPreviewCard
          ? [`/images/projects/previews/${project.slug}-full.jpg`]
          : [],
    tone,
    result: project.results?.[0],
    plus: project.slug === "hylo-athletics" || project.slug === "maeving",
  };
}

export default function HomePage() {
  const shopifyProjects = getFeaturedProjects("shopify").map(toWaveProject);
  const brandingProjects = getFeaturedProjects("branding").map(toWaveProject);
  return (
    <WavePortfolio shopifyProjects={shopifyProjects} brandingProjects={brandingProjects} />
  );
}
