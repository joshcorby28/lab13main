import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-end pb-24 pt-36">
      <Container>
        <p className="eyebrow text-muted">404</p>
        <h1 className="display mt-5 text-[clamp(3rem,8vw,6.5rem)]">
          This page hasn&apos;t been built.
        </h1>
        <p className="mt-6 max-w-md text-[1.05rem] text-ink-soft">
          The route doesn&apos;t exist. Head back to the work, or start a project with us.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/">Home</Button>
          <Button href="/work" variant="ghost">
            Work
          </Button>
        </div>
      </Container>
    </section>
  );
}
