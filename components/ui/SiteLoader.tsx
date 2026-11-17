"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";

const MIN_DURATION = 1400;
const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteLoader() {
  const pathname = usePathname();
  const skip = pathname?.startsWith("/keystatic") ?? false;
  const [visible, setVisible] = useState(true);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (skip) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDuration = reduce ? 300 : MIN_DURATION;
    const start = performance.now();
    let loaded = document.readyState === "complete";
    let progress = 0;
    let frame = 0;
    let finished = false;

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    // Safety net — never trap visitors behind the loader.
    const failsafe = window.setTimeout(() => {
      loaded = true;
    }, 6000);

    const tick = () => {
      const elapsed = performance.now() - start;
      const timeShare = Math.min(1, elapsed / minDuration);
      // Creep toward 90 while loading, then run to 100 once ready.
      const goal = loaded ? 100 * timeShare : Math.min(90, 100 * timeShare);
      progress += (goal - progress) * 0.12;
      if (loaded && timeShare >= 1 && progress > 99.4) progress = 100;

      const value = Math.round(progress);
      if (countRef.current) countRef.current.textContent = String(value).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress / 100})`;

      if (progress >= 100 && !finished) {
        finished = true;
        window.setTimeout(() => setVisible(false), reduce ? 0 : 180);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
    };
  }, [skip]);

  return (
    <AnimatePresence>
      {visible && !skip ? (
        <motion.div
          key="site-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center text-white"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 20% 15%, rgba(184,169,157,0.14), transparent 55%), radial-gradient(ellipse 80% 60% at 85% 80%, rgba(143,168,255,0.08), transparent 50%), #0a0908",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)", scale: 1.03 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="wave-chrome text-white/85">{site.shortName}</p>
            <span className="relative mt-5 block h-px w-28 overflow-hidden bg-white/12">
              <span
                ref={barRef}
                className="absolute inset-0 origin-left bg-white/80"
                style={{ transform: "scaleX(0)" }}
              />
            </span>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-6 sm:px-10">
            <p className="wave-chrome px-2 py-2 text-white/55">We know Shopify</p>
            <p className="wave-chrome px-2 py-2 tabular-nums text-white/55">
              <span ref={countRef}>000</span>
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
