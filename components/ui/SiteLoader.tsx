"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";

const MIN_DURATION = 1800;
const EASE = [0.22, 1, 0.36, 1] as const;
const LINES = 22;

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
) {
  ctx.clearRect(0, 0, width, height);

  const cy = height * 0.5;
  const amp = Math.min(height * 0.11, 90);
  const gap = Math.min(height * 0.0105, 9);
  // Roughly three "cards" across the viewport, like the portfolio camera.
  const k = (Math.PI * 2 * 1.35) / width;
  const step = Math.max(4, width / 260);
  const mid = (LINES - 1) / 2;

  for (let i = 0; i < LINES; i += 1) {
    const offset = i - mid;
    const centrality = 1 - Math.abs(offset) / (mid + 1);
    // Stagger each line's draw-in so the ribbon sweeps rather than wipes.
    const stagger = Math.abs(offset) / mid;
    const lineReveal = Math.min(1, Math.max(0, (reveal * 1.25 - stagger * 0.25)));
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

    const alpha = 0.08 + 0.42 * centrality * centrality;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.lineWidth = i === Math.round(mid) ? 1.25 : 0.9;
    ctx.stroke();

    // Bright leading point while a line is still drawing in.
    if (lineReveal < 1) {
      const phase = endX * k - time * 0.9;
      const wave = Math.cos(phase);
      const y = cy + wave * amp + offset * gap * (1 + 0.55 * wave);
      ctx.beginPath();
      ctx.arc(endX, y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.25 + 0.6 * centrality})`;
      ctx.fill();
    }
  }
}

export function SiteLoader() {
  const pathname = usePathname();
  const skip = pathname?.startsWith("/keystatic") ?? false;
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (skip) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      setVisible(false);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minDuration = reduce ? 300 : MIN_DURATION;
    const start = performance.now();
    let loaded = document.readyState === "complete";
    let progress = 0;
    let frame = 0;
    let finished = false;
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
    }, 6000);

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();
      const elapsed = now - start;
      const timeShare = Math.min(1, elapsed / minDuration);
      // Creep toward 90 while loading, then run to 100 once ready.
      const goal = loaded ? 100 * timeShare : Math.min(90, 100 * timeShare);
      progress += (goal - progress) * 0.1;
      if (loaded && timeShare >= 1 && progress > 99.4) progress = 100;

      if (countRef.current) {
        countRef.current.textContent = String(Math.round(progress)).padStart(3, "0");
      }

      const eased = 1 - Math.pow(1 - progress / 100, 2);
      drawRibbon(ctx, width, height, reduce ? 0 : elapsed * 0.001, eased);

      if (progress >= 100 && !finished) {
        finished = true;
        // Keep the ribbon moving through the exit fade.
        window.setTimeout(() => setVisible(false), reduce ? 0 : 260);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", resize);
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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-black via-black/80 to-transparent sm:w-[22%]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-black via-black/80 to-transparent sm:w-[22%]" />

          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-6 sm:px-10">
              <p className="wave-chrome px-2 py-2 text-white">{site.shortName}</p>
              <p className="wave-chrome px-2 py-2 text-white/55">Loading</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-6 sm:px-10">
              <p className="wave-chrome px-2 py-2 text-white/55">We know Shopify</p>
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
