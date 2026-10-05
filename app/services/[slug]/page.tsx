import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/cta/CtaBand";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { getService, services } from "@/content/services";
import { getProject } from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.title,
    description: service.intro,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedProjects
    .map((item) => getProject(item))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <Container>
          <p className="eyebrow text-muted">{service.number} / Services</p>
          <h1 className="display mt-5 max-w-[12ch] text-[clamp(3rem,8vw,7.2rem)]">
            {service.title}
          </h1>
          <p className="mt-8 max-w-2xl text-[1.2rem] leading-[1.65] text-ink-soft">
            {service.intro}
          </p>
        </Container>
      </header>

      <section className="border-t border-line">
        <Container className="py-20 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display text-[clamp(2rem,4vw,3.2rem)]">The work</h2>
            </div>
            <p className="text-[1.08rem] leading-[1.75] text-ink-soft lg:col-span-6 lg:col-start-7">
              {service.description}
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container className="py-20 lg:py-28">
          <p className="eyebrow text-muted">Capabilities</p>
          <ul className="mt-8 grid gap-px border-t border-line md:grid-cols-2">
            {service.capabilities.map((item, index) => (
              <li key={item} className="flex gap-4 border-b border-line py-5">
                <span className="eyebrow text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[1.15rem] tracking-[-0.02em]">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section data-nav-theme="dark" className="bg-dark text-paper">
        <Container className="py-20 lg:py-28">
          <p className="eyebrow text-dark-muted">Process</p>
          <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.6rem)]">How we take it through.</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-2">
            {service.process.map((step, index) => (
              <li key={step.title} className="border-t border-dark-line pt-6">
                <p className="eyebrow text-dark-muted">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[1.4rem] tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-dark-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {related.length ? (
        <section>
          <Container className="py-20 lg:py-28">
            <p className="eyebrow text-muted">Relevant work</p>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {related.map((project) => (
                <Link key={project.slug} href="/" data-cursor="VIEW" className="group">
                  <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                      <ProjectMedia media={project.hero} sizes="(min-width: 768px) 50vw, 100vw" />
                    </div>
                  </div>
                  <h3 className="display mt-5 text-[clamp(1.6rem,3vw,2.2rem)]">{project.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-muted">{project.summary}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand title="Let's talk about the brief." />
    </>
  );
}
