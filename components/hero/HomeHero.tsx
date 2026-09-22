"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { studio } from "@/content/studio";

const lines = ["Shopify experiences", "built to perform."];

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end pb-10 pt-28">
      <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-start justify-between gap-8">
          <p className="eyebrow max-w-[14rem] text-muted">
            Independent studio · Shopify / Plus
          </p>
          <p className="hidden max-w-xs text-right text-[0.8rem] leading-relaxed text-muted md:block">
            Currently accepting new clients
          </p>
        </div>

        <div className="py-[8vh]">
          <p className="eyebrow mb-6 text-muted">
            {site.shortName}
          </p>
          <h1 className="display max-w-[18ch] text-[clamp(3.4rem,10.4vw,9.4rem)]">
            {lines.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.95,
                    delay: 0.12 + index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <div className="grid items-end gap-8 border-t border-line pt-8 md:grid-cols-12">
          <motion.p
            className="max-w-xl text-[1.05rem] leading-[1.65] text-ink-soft md:col-span-7 lg:text-[1.15rem]"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {studio.headline} We design and develop Shopify and Shopify Plus
            experiences, custom functionality and migrations — working directly
            with the brand.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-6 md:col-span-5 md:justify-end"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/work"
              className="text-[0.85rem] tracking-[0.12em] uppercase underline decoration-line underline-offset-8 transition-colors hover:decoration-ink"
            >
              Selected work
            </Link>
            <Link
              href="/contact"
              className="bg-ink px-6 py-3.5 text-[0.75rem] tracking-[0.16em] text-[var(--paper)] uppercase transition-colors hover:bg-accent"
            >
              Start a project
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
