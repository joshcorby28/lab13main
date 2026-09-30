import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-line bg-void">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="display text-[clamp(2.4rem,6vw,4.8rem)]">
              Have a project in mind?
            </p>
            <Link
              href="/contact"
              data-cursor="BUILD"
              className="mt-6 inline-flex items-baseline gap-3 text-[clamp(1.6rem,3vw,2.4rem)] tracking-[-0.03em]"
            >
              <span>Let&apos;s build it.</span>
              <span aria-hidden className="text-accent">
                →
              </span>
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-3">
            <div>
              <p className="eyebrow text-muted">Studio</p>
              <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-ink-soft">
                {site.tagline}
              </p>
            </div>
            <a
              href={`mailto:${site.email}`}
              className="text-[0.95rem] underline decoration-line underline-offset-4 hover:decoration-paper"
            >
              {site.email}
            </a>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <p className="eyebrow text-muted">Navigate</p>
            <ul className="mt-3 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] text-ink-soft transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-[0.75rem] tracking-[0.04em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Independent Shopify studio · {site.location}</p>
        </div>
      </Container>
    </footer>
  );
}
