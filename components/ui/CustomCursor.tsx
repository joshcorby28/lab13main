"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const on = fine.matches && !reduce.matches;
      setEnabled(on);
      document.body.classList.toggle("has-cursor", on);
    };

    apply();
    fine.addEventListener("change", apply);
    reduce.addEventListener("change", apply);

    return () => {
      fine.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const leave = () => setVisible(false);

    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("[data-cursor]");
      setLabel(target?.getAttribute("data-cursor") ?? "");
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200] mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <div
        className={`grid place-items-center rounded-full border border-paper/80 bg-paper text-ink transition-[width,height,opacity] duration-300 ${
          label ? "h-16 w-16 opacity-100" : "h-3 w-3 opacity-90"
        } ${visible ? "scale-100" : "scale-0"}`}
      >
        {label ? (
          <span className="eyebrow text-[0.55rem] tracking-[0.18em]">{label}</span>
        ) : null}
      </div>
    </motion.div>
  );
}
