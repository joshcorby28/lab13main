import Link from "next/link";
import { cx } from "@/lib/utils";

const styles = {
  primary:
    "bg-ink text-[var(--paper)] hover:bg-accent hover:text-[var(--paper)]",
  inverse:
    "bg-paper text-ink hover:bg-paper-2",
  ghost:
    "border border-current bg-transparent hover:bg-ink hover:text-paper hover:border-ink",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  const classes = cx(
    "inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[0.8rem] tracking-[0.14em] uppercase transition-colors duration-300",
    styles[variant],
    className,
  );

  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
