"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [desktop, setDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pos = useRef({ x: -999, y: -999, tx: -999, ty: -999 });
  const activeRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
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
      pos.current.x += (pos.current.tx - pos.current.x) * 0.16;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.16;
      const node = float.current;
      if (node) {
        const visible = activeRef.current !== null;
        node.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
        node.style.opacity = visible ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [desktop]);

  const preview =
    desktop && mounted
      ? createPortal(
          <div
            ref={float}
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-[60] h-[240px] w-[340px] overflow-hidden bg-void-3 opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition-opacity duration-200 lg:h-[300px] lg:w-[420px]"
            style={{ transform: "translate3d(-999px, -999px, 0)", willChange: "transform, opacity" }}
          >
            {projects.map((project, index) => {
              const media = projectThumb(project);
              if (media.kind !== "image") {
                return (
                  <div
                    key={project.slug}
                    className={cx(
                      "absolute inset-0",
                      active === index ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <ProjectMedia media={media} sizes="420px" />
                  </div>
                );
              }
              return (
                <Image
                  key={project.slug}
                  src={media.src}
                  alt=""
                  width={840}
                  height={600}
                  priority={index < 3}
                  className={cx(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
                    active === index ? "opacity-100" : "opacity-0",
                  )}
                  sizes="420px"
                />
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative">
      {preview}

      <div className="flex flex-col border-t border-line">
        {projects.map((project, index) => {
          const media = projectThumb(project);
          return (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              data-cursor="VIEW"
              className="group relative grid grid-cols-12 items-center gap-4 border-b border-line py-7 transition-colors duration-500 hover:bg-void-2 sm:py-9 lg:py-11"
              onPointerEnter={(event) => {
                if (!desktop) return;
                activeRef.current = index;
                setActive(index);
                const x = event.clientX + 28;
                const y = event.clientY - 24;
                pos.current.tx = x;
                pos.current.ty = y;
                pos.current.x = x;
                pos.current.y = y;
              }}
              onPointerMove={(event) => {
                if (!desktop) return;
                pos.current.tx = event.clientX + 28;
                pos.current.ty = event.clientY - 24;
              }}
              onPointerLeave={() => {
                if (!desktop) return;
                activeRef.current = null;
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
              </div>

              <p className="col-span-12 hidden text-[0.85rem] leading-relaxed text-muted sm:col-span-3 sm:block lg:col-span-3">
                {project.industry}
              </p>

              <span className="col-span-12 hidden text-right text-[0.72rem] tracking-[0.16em] text-muted uppercase transition-colors duration-300 group-hover:text-paper sm:col-span-1 sm:block lg:col-span-2">
                Open
              </span>

              <div className="relative col-span-12 mt-4 aspect-[16/10] overflow-hidden bg-void-3 md:hidden">
                <ProjectMedia
                  media={media}
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectList(props: {
  projects: Project[];
  numbered?: boolean;
}) {
  return <WorkIndex {...props} />;
}
