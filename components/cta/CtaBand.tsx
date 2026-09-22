import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function CtaBand({
  title = "Have a project in mind?",
  body = "Currently accepting new clients. Tell us what you need help with — a new store, a Plus migration, an app, or a retainer.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section>
      <Container className="py-24 lg:py-32">
        <Reveal>
          <p className="eyebrow text-muted">Start a project</p>
          <h2 className="display mt-5 max-w-[12ch] text-[clamp(3rem,8vw,7rem)]">
            {title}
          </h2>
          <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
            {body}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/contact">Let&apos;s build it</Button>
            <Button href={`mailto:${site.email}`} variant="ghost">
              {site.email}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
