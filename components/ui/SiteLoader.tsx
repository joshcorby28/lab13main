"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { LoaderSettings } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Draws a ribbon of thin lines riding the same travelling cosine as the
 * WavePortfolio strip (cos(x * 0.82)). Lines draw in from the left as the
 * site loads, bulging apart at crests to fake the ribbon's depth.
 */
function drawRibbon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  reveal: number,
  lines: number,
  brightness: number,
) {
  ctx.clearRect(0, 0, width, height);

  const cy = height * 0.5;
  const amp = Math.min(height * 0.11, 90);
  // Keep the ribbon a similar overall thickness whatever the line count.
  const gap = (Math.min(height * 0.0105, 9) * 22) / Math.max(lines, 1);
  // Roughly three "cards" across the viewport, like the portfolio camera.
  const k = (Math.PI * 2 * 1.35) / width;
  const step = Math.max(4, width / 260);
  const mid = (lines - 1) / 2;

  for (let i = 0; i < lines; i += 1) {
    const offset = i - mid;
    const centrality = 1 - Math.abs(offset) / (mid + 1);
    // Stagger each line's draw-in so the ribbon sweeps rather than wipes.
    const stagger = mid > 0 ? Math.abs(offset) / mid : 0;
    const lineReveal = Math.min(1, Math.max(0, reveal * 1.25 - stagger * 0.25));
    if (lineReveal <= 0) continue;
    const endX = width * lineReveal;

    // Warm metal at the core, cooler toward the edges — the backdrop's palette.
    const warm = centrality;
    const r = Math.round(184 * warm + 160 * (1 - warm));
    const g = Math.round(169 * warm + 180 * (1 - warm));
    const b = Math.round(157 * warm + 255 * (1 - warm));

    ctx.beginPath();
    for (let x = 0; x <= endX; x += step) {
      const phase = x * k - time * 0.9;
      const wave = Math.cos(phase);
      const ripple = Math.sin(x * k * 2.3 + time * 1.6 + i * 0.35) * 0.12;
      const spread = 1 + 0.55 * wave;
      const y = cy + wave * amp + offset * gap * spread + ripple * gap * 2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    const alpha = Math.min(1, (0.22 + 0.6 * centrality * centrality) * brightness);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.lineWidth = i === Math.round(mid) ? 1.8 : 1.25;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
    ctx.shadowBlur = 6 * centrality;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Bright leading point while a line is still drawing in.
    if (lineReveal < 1) {
      const phase = endX * k - time * 0.9;
      const wave = Math.cos(phase);
      const y = cy + wave * amp + offset * gap * (1 + 0.55 * wave);
      ctx.beginPath();
      ctx.arc(endX, y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, (0.4 + 0.6 * centrality) * brightness)})`;
      ctx.fill();
    }
  }
}

export function SiteLoader({
  settings,
  wordmark,
  tagline,
}: {
  settings: LoaderSettings;
  wordmark: string;
  tagline: string;
}) {
  const pathname = usePathname();
  const skip =
    !settings.enabled ||
    (pathname?.startsWith("/keystatic") ?? false) ||
    (pathname?.startsWith("/admin") ?? false);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const { duration, hold, lines, brightness } = settings;

  useEffect(() => {
    if (skip) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDuration = reduce ? 300 : duration * 1000;
    const holdMs = reduce ? 0 : hold * 1000;
    const start = performance.now();
    let loaded = document.readyState === "complete";
    let progress = 0;
    let frame = 0;
    let finished = false;
    let hideTimer = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    // Safety net — never trap visitors behind the loader.
    const failsafe = window.setTimeout(() => {
      loaded = true;
    }, Math.max(6000, minDuration + 2000));

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const elapsed = performance.now() - start;
      const timeShare = Math.min(1, elapsed / minDuration);
      // Creep toward 90 while loading, then run to 100 once ready.
      const goal = loaded ? 100 * timeShare : Math.min(90, 100 * timeShare);
      progress += (goal - progress) * 0.1;
      if (loaded && timeShare >= 1 && progress > 99.4) progress = 100;

      if (countRef.current) {
        countRef.current.textContent = String(Math.round(progress)).padStart(3, "0");
      }

      const eased = 1 - Math.pow(1 - progress / 100, 2);
      drawRibbon(ctx, width, height, reduce ? 0 : elapsed * 0.001, eased, lines, brightness);

      if (progress >= 100 && !finished) {
        finished = true;
        // Let the finished ribbon roll for a beat, and keep it moving through the exit fade.
        hideTimer = window.setTimeout(() => setVisible(false), holdMs);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
      window.clearTimeout(hideTimer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", resize);
    };
  }, [skip, duration, hold, lines, brightness]);

  return (
    <AnimatePresence>
      {visible && !skip ? (
        <motion.div
          key="site-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-[150] overflow-hidden text-white"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 20% 15%, rgba(184,169,157,0.14), transparent 55%), radial-gradient(ellipse 80% 60% at 85% 80%, rgba(143,168,255,0.08), transparent 50%), #0a0908",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)", scale: 1.035 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

          {/* Same vignette + side fades as the wave view */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-black/90 via-black/50 to-transparent sm:w-[16%]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[12%] bg-gradient-to-l from-black/90 via-black/50 to-transparent sm:w-[16%]" />

          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 sm:px-10">
              <p className="wave-chrome px-2 py-2 text-white">{wordmark}</p>
              {settings.label ? (
                <p className="wave-chrome px-2 py-2 text-white/55">{settings.label}</p>
              ) : null}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-6 sm:px-10">
              <p className="wave-chrome px-2 py-2 text-white/55">{tagline}</p>
              <p className="wave-chrome px-2 py-2 tabular-nums text-white/80">
                <span ref={countRef}>000</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
