import Link from "next/link";
import { HomeHero } from "@/components/hero/HomeHero";
import { ProjectList } from "@/components/projects/ProjectList";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { AboutPreview } from "@/components/about/AboutPreview";
import { ShopifyExpertise } from "@/components/expertise/ShopifyExpertise";
import { CtaBand } from "@/components/cta/CtaBand";
import { Container } from "@/components/ui/Container";
import { getFeaturedProjects } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lab 13",
  description:
    "A small family-run studio designing and developing thoughtfully crafted Shopify Plus stores, custom apps and migrations.",
  path: "/",
});

export default function HomePage() {
  const projects = getFeaturedProjects();

  return (
    <>
      <HomeHero />

      <section>
        <Container className="pt-8 pb-6 lg:pt-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-muted">Selected work</p>
              <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.4rem)]">
                Stores we keep in motion.
              </h2>
            </div>
            <Link
              href="/work"
              className="hidden text-[0.75rem] tracking-[0.16em] uppercase underline decoration-line underline-offset-8 hover:decoration-ink md:inline"
            >
              All work
            </Link>
          </div>
        </Container>
        <Container>
          <ProjectList projects={projects} />
          <div className="border-b border-line py-8 md:hidden">
            <Link href="/work" className="text-[0.75rem] tracking-[0.16em] uppercase underline underline-offset-8">
              All work
            </Link>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-24 lg:py-32">
          <p className="eyebrow text-muted">Services</p>
          <h2 className="display mt-4 max-w-[16ch] text-[clamp(2.4rem,5vw,4.6rem)]">
            What do you need help with?
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
            Shopify Plus, new store builds, migrations, custom apps and retainers —
            the work Lab 13 actually does.
          </p>
          <div className="mt-12">
            <ServiceIndex />
          </div>
        </Container>
      </section>

      <AboutPreview />
      <ShopifyExpertise />
      <CtaBand title="Have a project in mind?" />
    </>
  );
}
