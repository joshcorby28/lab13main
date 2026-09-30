"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "@/lib/site";

export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        "[data-hero-eyebrow]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8 },
      )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 120 },
          { yPercent: 0, duration: 1.2, stagger: 0.08 },
          0.1,
        )
        .fromTo(
          "[data-hero-copy]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 },
          0.45,
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end pb-10 pt-28"
    >
      <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-start justify-between gap-8">
          <p data-hero-eyebrow className="eyebrow max-w-[16rem] text-muted">
            Shopify Plus specialist studio
          </p>
          <p data-hero-eyebrow className="hidden max-w-xs text-right text-[0.8rem] leading-relaxed text-muted md:block">
            Currently accepting new clients
          </p>
        </div>

        <div className="py-[7vh]">
          <p data-hero-eyebrow className="eyebrow mb-7 text-accent">
            {site.shortName}
          </p>
          <h1 className="display max-w-[12ch] text-[clamp(3.8rem,13vw,11rem)]">
            <span className="block overflow-hidden">
              <span data-hero-line className="block will-change-transform">
                WE KNOW
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block will-change-transform">
                SHOPIFY.
              </span>
            </span>
          </h1>
        </div>

        <div className="grid items-end gap-8 border-t border-line pt-8 md:grid-cols-12">
          <p
            data-hero-copy
            className="max-w-xl text-[1.05rem] leading-[1.65] text-ink-soft md:col-span-7 lg:text-[1.15rem]"
          >
            Thoughtfully crafted Shopify Plus stores &amp; apps. A small
            family-run studio building Shopify Plus stores and custom apps —
            working directly with the brand.
          </p>
          <div
            data-hero-copy
            className="flex flex-wrap items-center gap-6 md:col-span-5 md:justify-end"
          >
            <Link
              href="#work"
              data-cursor="SCROLL"
              className="text-[0.85rem] tracking-[0.14em] uppercase underline decoration-line underline-offset-8 transition-colors hover:decoration-paper"
            >
              Selected work
            </Link>
            <Link
              href="/contact"
              data-cursor="START"
              className="bg-paper px-6 py-3.5 text-[0.75rem] tracking-[0.16em] text-[#070707] uppercase transition-colors duration-300 hover:bg-accent"
            >
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
