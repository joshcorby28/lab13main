import Link from "next/link";
import { studio } from "@/content/studio";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";

export function AboutPreview() {
  return (
    <section id="about">
      <Container className="py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">The studio</p>
            <Reveal>
              <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">
                A small family-run Shopify Plus studio.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-[1.15rem] leading-[1.7] text-ink-soft">
                {studio.about}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 text-[1.05rem] leading-[1.7] text-ink-soft">
                {studio.positioning} You work with the people building the store —
                no account layers, no hand-off into a large production line.
              </p>
            </Reveal>
            <Link
              href="/about"
              data-cursor="ABOUT"
              className="mt-10 inline-block text-[0.75rem] tracking-[0.16em] uppercase underline decoration-line underline-offset-8 hover:decoration-paper"
            >
              About the studio
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
