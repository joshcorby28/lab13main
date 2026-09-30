import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { CtaBand } from "@/components/cta/CtaBand";
import { Button } from "@/components/ui/Button";
import {
  getProject,
  getRelatedProjects,
  projects,
} from "@/content/projects";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const related = getRelatedProjects(project.slug);

  return (
    <>
      <article>
        <header className="pt-32 lg:pt-40">
          <Container>
            <p className="eyebrow text-muted">
              {project.client} · {project.industry}
            </p>
            <h1 className="display mt-5 max-w-[16ch] text-[clamp(2.8rem,7vw,6.4rem)]">
              {project.intro}
            </h1>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[0.8rem] tracking-[0.08em] text-muted uppercase">
              {project.services.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </div>
          </Container>
          <div className="relative mt-12 aspect-[16/9] overflow-hidden bg-void-3 lg:mt-16">
            <ProjectMedia media={project.hero} priority sizes="100vw" />
          </div>
        </header>

        <Container className="py-20 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-muted">Overview</p>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-[0.75rem] tracking-[0.12em] text-muted uppercase">Client</dt>
                  <dd className="mt-1 text-[1.05rem]">{project.client}</dd>
                </div>
                <div>
                  <dt className="text-[0.75rem] tracking-[0.12em] text-muted uppercase">Industry</dt>
                  <dd className="mt-1 text-[1.05rem]">{project.industry}</dd>
                </div>
                {project.liveUrl ? (
                  <div>
                    <dt className="text-[0.75rem] tracking-[0.12em] text-muted uppercase">Live</dt>
                    <dd className="mt-1">
                      <a
                        href={project.liveUrl}
                        className="underline decoration-line underline-offset-4 hover:decoration-ink"
                        rel="noreferrer"
                        target="_blank"
                      >
                        View site
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-[1.2rem] leading-[1.7] text-ink-soft">{project.overview}</p>
            </div>
          </div>

          <div className="mt-20 grid gap-12 border-t border-line pt-16 md:grid-cols-2">
            <section>
              <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)]">Challenge</h2>
              <p className="mt-5 text-[1.02rem] leading-[1.75] text-ink-soft">{project.challenge}</p>
            </section>
            <section>
              <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)]">Solution</h2>
              <p className="mt-5 text-[1.02rem] leading-[1.75] text-ink-soft">{project.solution}</p>
            </section>
          </div>

          <section className="mt-16 border-t border-line pt-16">
            <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)]">Development</h2>
            <p className="mt-5 max-w-3xl text-[1.02rem] leading-[1.75] text-ink-soft">
              {project.development}
            </p>
          </section>

          {project.results?.length ? (
            <section className="mt-16 border-t border-line pt-16">
              <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)]">Results</h2>
              <ul className="mt-8 grid gap-6 md:grid-cols-3">
                {project.results.map((result) => (
                  <li key={result} className="border-t border-line pt-5 text-[1.15rem] leading-snug">
                    {result}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.quote ? (
            <blockquote className="mt-16 border-t border-line pt-16">
              <p className="display max-w-3xl text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15]">
                “{project.quote.text}”
              </p>
              <footer className="mt-6 eyebrow text-muted">
                {project.quote.attribution}
              </footer>
            </blockquote>
          ) : null}

          {project.gallery.length ? (
            <div className="mt-16 grid gap-4 md:grid-cols-2">
              {project.gallery.map((media, index) => (
                <div key={index} className="relative aspect-[16/10] overflow-hidden bg-void-3">
                  <ProjectMedia media={media} sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
              ))}
            </div>
          ) : null}

          <section className="mt-16 border-t border-line pt-16">
            <h2 className="eyebrow text-muted">Technologies</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <li key={tech} className="border border-line px-3 py-1.5 text-[0.75rem] tracking-[0.08em] uppercase">
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </article>

      {related.length ? (
        <section className="border-t border-line">
          <Container className="py-20">
            <p className="eyebrow text-muted">More work</p>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {related.map((item) => (
                <Link key={item.slug} href={`/work/${item.slug}`} data-cursor="VIEW" className="group">
                  <div className="relative aspect-[16/10] overflow-hidden bg-void-3">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                      <ProjectMedia media={item.hero} sizes="(min-width: 768px) 50vw, 100vw" />
                    </div>
                  </div>
                  <h3 className="display mt-5 text-[clamp(1.6rem,3vw,2.2rem)]">{item.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-muted">{item.industry}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand title="Let's build the next one." />
      <div className="pb-10">
        <Container>
          <Button href="/work" variant="ghost">
            Back to work
          </Button>
        </Container>
      </div>
    </>
  );
}
