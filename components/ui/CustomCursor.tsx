"use client";

import { useEffect, useState } from "react";

type CursorState = {
  x: number;
  y: number;
  label: string;
  visible: boolean;
  hovering: boolean;
};

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>({
    x: -100,
    y: -100,
    label: "",
    visible: false,
    hovering: false,
  });

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

    let raf = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let label = "";
    let hovering = false;
    let visible = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setState({
        x: currentX,
        y: currentY,
        label,
        visible,
        hovering,
      });
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      visible = true;
    };

    const leave = () => {
      visible = false;
    };

    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("[data-cursor]");
      label = target?.getAttribute("data-cursor") ?? "";
      hovering = Boolean(target);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = state.hovering ? 72 : 10;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[110] mix-blend-difference"
      style={{
        transform: `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`,
        opacity: state.visible ? 1 : 0,
        transition: "opacity 200ms ease",
      }}
    >
      <div
        className="grid place-items-center rounded-full border border-paper bg-paper text-void"
        style={{
          width: size,
          height: size,
          transition: "width 280ms cubic-bezier(0.16,1,0.3,1), height 280ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {state.label ? (
          <span className="eyebrow text-[0.55rem] tracking-[0.2em] text-void">
            {state.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
