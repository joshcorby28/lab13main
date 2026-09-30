import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";

export function ContactOversize({
  title = "Start a project.",
  body = "Currently accepting new clients. Tell us about the store, the migration, or the app you need built.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section id="contact" className="border-t border-line">
      <Container className="py-24 lg:py-36">
        <Reveal>
          <p className="eyebrow text-muted">Contact</p>
          <h2 className="display mt-6 max-w-[11ch] text-[clamp(3.6rem,11vw,9.5rem)]">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 max-w-lg text-[1.08rem] leading-relaxed text-ink-soft">
            {body}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <a
              href={`mailto:${site.email}`}
              data-cursor="EMAIL"
              className="display text-[clamp(1.6rem,4vw,3.2rem)] tracking-[-0.04em] underline decoration-line underline-offset-[12px] transition-colors hover:decoration-accent"
            >
              {site.email}
            </a>
            <Link
              href="/contact"
              data-cursor="WRITE"
              className="inline-flex w-fit items-center gap-3 bg-paper px-7 py-4 text-[0.75rem] tracking-[0.16em] text-void uppercase transition-colors hover:bg-accent"
            >
              Write to us
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/** Alias for existing imports */
export function CtaBand({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  return <ContactOversize title={title} body={body} />;
}
