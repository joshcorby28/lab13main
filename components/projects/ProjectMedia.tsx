import Image from "next/image";
import type { Media } from "@/content/projects";
import { cx } from "@/lib/utils";

const tones: Record<Extract<Media, { kind: "field" }>["tone"], string> = {
  moss: "from-[#1c2a20] via-[#2a3b2c] to-[#0f1611]",
  steel: "from-[#1a1c20] via-[#2c3138] to-[#0e1012]",
  cashmere: "from-[#3a332c] via-[#4a4036] to-[#2a241f]",
  ink: "from-[#161513] via-[#23211d] to-[#0c0b0a]",
  sand: "from-[#3a342c] via-[#4a4338] to-[#2a261f]",
};

export function ProjectMedia({
  media,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  media: Media;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cx("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cx(
        "absolute inset-0 bg-linear-to-br text-paper",
        tones[media.tone],
        className,
      )}
    >
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:72px_72px]" />
      <p className="display absolute bottom-6 left-6 text-[clamp(2rem,6vw,4.5rem)] opacity-80">
        {media.label}
      </p>
    </div>
  );
}
