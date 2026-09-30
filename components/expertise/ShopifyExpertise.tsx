import { studio } from "@/content/studio";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";

export function ShopifyExpertise() {
  return (
    <section className="border-t border-line bg-void-2">
      <Container className="py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">Shopify expertise</p>
            <Reveal>
              <h2 className="display mt-5 text-[clamp(2.2rem,4.5vw,3.8rem)]">
                Built around the platform.
              </h2>
            </Reveal>
            <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
              From Liquid themes to Plus migrations and custom apps — the stack Lab 13
              works in every week.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="grid gap-px border border-line sm:grid-cols-2">
              {studio.expertise.map((item) => (
                <li key={item.name} className="border-b border-line bg-void px-5 py-6 sm:odd:border-r">
                  <p className="text-[1.05rem] tracking-[-0.02em]">{item.name}</p>
                  <p className="mt-2 text-[0.88rem] text-muted">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
