import Link from "next/link";
import { studio } from "@/content/studio";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";

export function AboutPreview() {
  return (
    <section>
      <Container className="py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">The studio</p>
            <Reveal>
              <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">
                Small. Direct. Built around Shopify.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-[1.15rem] leading-[1.7] text-ink-soft">
                {studio.story}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 text-[1.05rem] leading-[1.7] text-ink-soft">
                {studio.approach}
              </p>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {studio.people.map((person) => (
                <div key={person.name} className="border-t border-line pt-4">
                  <p className="text-[1.05rem] tracking-[-0.02em]">{person.name}</p>
                  <p className="mt-1 text-[0.85rem] text-muted">{person.role}</p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-10 inline-block text-[0.75rem] tracking-[0.16em] uppercase underline decoration-line underline-offset-8 hover:decoration-ink"
            >
              About the studio
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
