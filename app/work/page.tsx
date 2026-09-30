import { Container } from "@/components/ui/Container";
import { ProjectList } from "@/components/projects/ProjectList";
import { CtaBand } from "@/components/cta/CtaBand";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Selected Shopify and Shopify Plus work from Lab 13 — Hylo Athletics, Project Cosmetics, Amy Lynn, Maeving and Studio 163.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section className="pt-32 pb-10 lg:pt-40">
        <Container>
          <p className="eyebrow text-muted">Work</p>
          <h1 className="display mt-5 max-w-[14ch] text-[clamp(3rem,8vw,7rem)]">
            Selected projects.
          </h1>
          <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-ink-soft">
            Shopify and Shopify Plus stores, migrations and ongoing development for
            brands including Hylo Athletics, Project Cosmetics, Amy Lynn, Maeving and
            Studio 163.
          </p>
        </Container>
      </section>
      <Container>
        <ProjectList projects={projects} />
      </Container>
      <CtaBand />
    </>
  );
}
