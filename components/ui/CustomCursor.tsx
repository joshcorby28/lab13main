"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: -100, y: -100, visible: false, label: "" });
  const raf = useRef(0);

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

    const render = () => {
      raf.current = requestAnimationFrame(render);
      const el = dotRef.current;
      if (!el) return;
      const { x, y, visible, label } = pos.current;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = visible ? "1" : "0";
      el.dataset.label = label ? "1" : "0";
      if (labelRef.current) {
        if (labelRef.current.textContent !== label) labelRef.current.textContent = label;
      }
    };
    raf.current = requestAnimationFrame(render);

    const move = (event: PointerEvent) => {
      pos.current.x = event.clientX;
      pos.current.y = event.clientY;
      pos.current.visible = true;
    };

    const leave = () => {
      pos.current.visible = false;
    };

    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("[data-cursor]");
      pos.current.label = target?.getAttribute("data-cursor") ?? "";
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200] mix-blend-difference"
      style={{ opacity: 0, willChange: "transform" }}
    >
      <div className="cursor-dot grid place-items-center rounded-full border border-paper/80 bg-paper text-ink">
        <span ref={labelRef} className="eyebrow text-[0.55rem] tracking-[0.18em]" />
      </div>
    </div>
  );
}
