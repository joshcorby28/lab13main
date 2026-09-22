import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/cta/CtaBand";
import { studio } from "@/content/studio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Lab 13 is a family-run Shopify studio founded by Joshua and Hayden Corby — 18 years of combined experience in Shopify Plus, development and design.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <header className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <Container>
          <p className="eyebrow text-muted">About</p>
          <h1 className="display mt-5 max-w-[16ch] text-[clamp(2.8rem,7vw,6.6rem)]">
            {studio.about}
          </h1>
        </Container>
      </header>

      <section className="border-t border-line">
        <Container className="py-20 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12">
            <h2 className="display text-[clamp(2rem,4vw,3.2rem)] lg:col-span-4">
              The studio
            </h2>
            <div className="space-y-6 text-[1.08rem] leading-[1.75] text-ink-soft lg:col-span-7 lg:col-start-6">
              <p>{studio.story}</p>
              <p>{studio.mission}</p>
              <p>{studio.approach}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line">
        <Container className="py-20 lg:py-28">
          <p className="eyebrow text-muted">Founders</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {studio.people.map((person) => (
              <article key={person.name} className="border-t border-line pt-6">
                <h3 className="display text-[clamp(2rem,4vw,3rem)]">{person.name}</h3>
                <p className="mt-3 text-muted">{person.role}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="pb-20 lg:pb-28">
          <p className="eyebrow text-muted">How we work</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {studio.principles.map((item) => (
              <article key={item.title} className="border-t border-line pt-6">
                <h3 className="text-[1.4rem] tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Get in touch to start the journey together." />
    </>
  );
}
