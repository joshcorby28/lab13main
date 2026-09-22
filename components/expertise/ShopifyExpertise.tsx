import { studio } from "@/content/studio";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";

export function ShopifyExpertise() {
  return (
    <section data-nav-theme="dark" className="bg-dark text-paper">
      <Container className="py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-dark-muted">Shopify expertise</p>
            <Reveal>
              <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.4rem)]">
                Technical where it counts.
              </h2>
            </Reveal>
            <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-dark-muted">
              Lab 13 is a specialist Shopify studio. The work is development-led:
              Plus stores, migrations, custom apps, and the functionality a
              merchant cannot buy off the shelf.
            </p>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-px bg-dark-line sm:grid-cols-2">
              {studio.expertise.map((item, index) => (
                <Reveal key={item.name} delay={index * 0.03}>
                  <li className="bg-dark px-5 py-6">
                    <p className="text-[1.15rem] tracking-[-0.03em]">{item.name}</p>
                    <p className="mt-2 text-[0.88rem] text-dark-muted">{item.note}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
