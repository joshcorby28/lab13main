import { Container } from "@/components/ui/Container";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { CtaBand } from "@/components/cta/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Shopify development, Shopify Plus, migrations, custom apps and retainers from Lab 13.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="pt-32 pb-6 lg:pt-40">
        <Container>
          <p className="eyebrow text-muted">Services</p>
          <h1 className="display mt-5 max-w-[14ch] text-[clamp(3rem,8vw,7rem)]">
            Shopify, end to end.
          </h1>
          <p className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-ink-soft">
            We design and build eye-catching ecommerce websites for big and small
            brands around the globe — then stay on for the work that comes after launch.
          </p>
        </Container>
      </section>
      <Container className="pb-16">
        <ServiceIndex />
      </Container>
      <CtaBand />
    </>
  );
}
