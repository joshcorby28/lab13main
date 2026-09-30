"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, site } from "@/lib/site";
import { cx } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState(pathname);

  if (route !== pathname) {
    setRoute(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 text-ink transition-colors duration-500",
        scrolled && !open ? "bg-void/75 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] w-full max-w-[1560px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          data-cursor="HOME"
          className="group flex items-baseline gap-3"
          aria-label={`${site.name} home`}
        >
          <span className="text-[1.05rem] font-medium tracking-[-0.04em]">
            {site.shortName}
          </span>
          <span className="eyebrow hidden text-muted sm:inline">Shopify studio</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-cursor={item.label.toUpperCase()}
                className={cx(
                  "relative text-[0.8rem] tracking-[0.08em] uppercase transition-opacity duration-300 hover:opacity-100",
                  active ? "opacity-100" : "opacity-45",
                )}
              >
                {item.label}
                <span
                  className={cx(
                    "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            data-cursor="START"
            className="eyebrow hidden text-muted transition-colors hover:text-paper md:inline"
          >
            Start a project
          </Link>
          <button
            type="button"
            className="relative h-10 w-10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              className={cx(
                "absolute top-[15px] right-2 left-2 h-px bg-current transition-transform duration-300",
                open && "translate-y-[4.5px] rotate-45",
              )}
            />
            <span
              className={cx(
                "absolute top-[24px] right-2 left-2 h-px bg-current transition-transform duration-300",
                open && "-translate-y-[4.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-void px-5 pt-28 pb-10 text-ink sm:px-8"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-2">
              {nav.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.08 + index * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    className="display block text-[clamp(2.8rem,12vw,5.5rem)]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <a href={`mailto:${site.email}`} className="text-lg text-ink-soft">
              {site.email}
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
