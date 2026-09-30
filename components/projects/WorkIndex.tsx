"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { cx } from "@/lib/utils";

function projectThumb(project: Project) {
  if (project.hero.kind === "image") return project.hero;
  const fallback = project.gallery.find((item) => item.kind === "image");
  return fallback ?? project.hero;
}

export function WorkIndex({
  projects,
  numbered = true,
}: {
  projects: Project[];
  numbered?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [desktop, setDesktop] = useState(false);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setDesktop(mq.matches && !reduce.matches);
    apply();
    mq.addEventListener("change", apply);
    reduce.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (!desktop) return;
    let raf = 0;

    const tick = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.12;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.12;
      if (float.current) {
        float.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [desktop]);

  return (
    <div ref={root} className="relative">
      {desktop ? (
        <div
          ref={float}
          aria-hidden
          className={cx(
            "pointer-events-none fixed top-0 left-0 z-40 hidden h-[280px] w-[400px] overflow-hidden rounded-[2px] md:block",
            "transition-[opacity,clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            active === null
              ? "opacity-0 [clip-path:inset(12%_12%_12%_12%)]"
              : "opacity-100 [clip-path:inset(0%_0%_0%_0%)]",
          )}
        >
          {projects.map((project, index) => {
            const media = projectThumb(project);
            return (
              <div
                key={project.slug}
                className={cx(
                  "absolute inset-0 transition-opacity duration-300",
                  active === index ? "opacity-100" : "opacity-0",
                )}
              >
                {media.kind === "image" ? (
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                ) : (
                  <ProjectMedia media={media} sizes="400px" />
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col border-t border-line">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            data-cursor="VIEW"
            className="group relative grid grid-cols-12 items-center gap-4 border-b border-line py-7 transition-colors duration-500 hover:bg-void-2 sm:py-9 lg:py-11"
            onPointerEnter={() => {
              if (!desktop) return;
              setActive(index);
            }}
            onPointerMove={(event) => {
              if (!desktop) return;
              pos.current.tx = event.clientX + 36;
              pos.current.ty = event.clientY;
            }}
            onPointerLeave={() => {
              if (!desktop) return;
              setActive(null);
            }}
          >
            {numbered ? (
              <span className="eyebrow col-span-2 text-muted sm:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : (
              <span className="col-span-2 sm:col-span-1" />
            )}

            <div className="col-span-10 sm:col-span-7 lg:col-span-6">
              <h3 className="display text-[clamp(1.7rem,4.2vw,3.6rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                {project.title}
              </h3>
              <p className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-muted md:hidden">
                {project.summary}
              </p>
            </div>

            <p className="col-span-12 hidden text-[0.85rem] leading-relaxed text-muted sm:col-span-3 sm:block lg:col-span-3">
              {project.industry}
            </p>

            <span className="col-span-12 hidden text-right text-[0.72rem] tracking-[0.16em] text-muted uppercase transition-colors duration-300 group-hover:text-paper sm:col-span-1 sm:block lg:col-span-2">
              Open
            </span>

            {!desktop ? (
              <div className="relative col-span-12 mt-4 aspect-[16/10] overflow-hidden bg-void-3 sm:hidden">
                <ProjectMedia
                  media={projectThumb(project)}
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** @deprecated Prefer WorkIndex for the interactive list */
export function ProjectList(props: {
  projects: Project[];
  numbered?: boolean;
}) {
  return <WorkIndex {...props} />;
}
