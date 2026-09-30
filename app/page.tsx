import Link from "next/link";
import { HomeHero } from "@/components/hero/HomeHero";
import { WorkIndex } from "@/components/projects/WorkIndex";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { AboutPreview } from "@/components/about/AboutPreview";
import { ContactOversize } from "@/components/cta/CtaBand";
import { Container } from "@/components/ui/Container";
import { getFeaturedProjects } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Lab 13",
  description:
    "Thoughtfully crafted Shopify Plus stores & apps. A small family-run studio building Shopify Plus stores and custom apps.",
  path: "/",
});

export default function HomePage() {
  const projects = getFeaturedProjects();

  return (
    <>
      <HomeHero />

      <section id="work">
        <Container className="pt-8 pb-6 lg:pt-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-muted">Selected work</p>
              <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.4rem)]">
                Stores in motion.
              </h2>
            </div>
            <Link
              href="/work"
              data-cursor="ALL"
              className="hidden text-[0.75rem] tracking-[0.16em] uppercase underline decoration-line underline-offset-8 hover:decoration-paper md:inline"
            >
              All work
            </Link>
          </div>
        </Container>
        <Container>
          <WorkIndex projects={projects} />
          <div className="border-b border-line py-8 md:hidden">
            <Link
              href="/work"
              className="text-[0.75rem] tracking-[0.16em] uppercase underline underline-offset-8"
            >
              All work
            </Link>
          </div>
        </Container>
      </section>

      <section id="services">
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
      <ContactOversize />
    </>
  );
}
