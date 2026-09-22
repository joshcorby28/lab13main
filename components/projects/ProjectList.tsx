import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { Reveal } from "@/components/animations/Reveal";
import { cx } from "@/lib/utils";

export function ProjectList({
  projects,
  numbered = true,
}: {
  projects: Project[];
  numbered?: boolean;
}) {
  return (
    <div className="flex flex-col">
      {projects.map((project, index) => (
        <ProjectRow
          key={project.slug}
          project={project}
          index={index}
          total={projects.length}
          numbered={numbered}
        />
      ))}
    </div>
  );
}

function ProjectRow({
  project,
  index,
  total,
  numbered,
}: {
  project: Project;
  index: number;
  total: number;
  numbered: boolean;
}) {
  const odd = index % 2 === 1;

  return (
    <Reveal>
      <article className="border-t border-line py-10 last:border-b lg:py-16">
        <Link
          href={`/work/${project.slug}`}
          data-cursor="VIEW"
          className="group grid items-end gap-8 lg:grid-cols-12"
        >
          <div
            className={cx(
              "relative overflow-hidden bg-paper-2 lg:col-span-7",
              odd && "lg:order-2",
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                <ProjectMedia media={project.hero} priority={index === 0} />
              </div>
            </div>
          </div>

          <div className={cx("lg:col-span-5", odd ? "lg:order-1 lg:pr-8" : "lg:pl-4")}>
            {numbered ? (
              <p className="eyebrow text-muted">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
            ) : null}
            <h3 className="display mt-4 text-[clamp(2rem,4.4vw,3.8rem)]">
              {project.title}
            </h3>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
              {project.summary}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[0.72rem] tracking-[0.12em] text-muted uppercase">
              <li>{project.industry}</li>
              {project.services.slice(0, 2).map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
            <p className="mt-8 text-[0.75rem] tracking-[0.16em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              Open case study
            </p>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
