import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Let’s talk about your Shopify project. Email Lab 13 at info@lab-13.co.uk.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">Contact</p>
            <h1 className="display mt-5 text-[clamp(3.4rem,9vw,8rem)]">
              Let&apos;s talk.
            </h1>
            <p className="mt-6 max-w-md text-[1.08rem] leading-relaxed text-ink-soft">
              Currently accepting new clients. Say hello with a short note about
              the store, the migration, or the app you need built.
            </p>
            <dl className="mt-12 space-y-6">
              <div>
                <dt className="eyebrow text-muted">Email</dt>
                <dd className="mt-2 text-[1.2rem]">
                  <a href={`mailto:${site.email}`} className="underline decoration-line underline-offset-4 hover:decoration-ink">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-muted">Studio</dt>
                <dd className="mt-2 text-[1.05rem] text-ink-soft">
                  Independent Shopify studio
                  <br />
                  {site.location}
                </dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
