import Link from "next/link";
import { services } from "@/content/services";
import { Reveal } from "@/components/animations/Reveal";

export function ServiceIndex() {
  return (
    <div className="border-t border-line">
      {services.map((service, index) => (
        <Reveal key={service.slug} delay={index * 0.04}>
          <Link
            href={`/services/${service.slug}`}
            data-cursor="OPEN"
            className="group grid grid-cols-12 items-center gap-4 border-b border-line px-2 py-7 transition-colors duration-300 hover:bg-ink hover:text-paper sm:px-3 sm:py-8"
          >
            <span className="eyebrow col-span-2 text-current/50 sm:col-span-1">
              {service.number}
            </span>
            <h3 className="display col-span-9 text-[clamp(1.5rem,3.2vw,2.6rem)] sm:col-span-7">
              {service.title}
            </h3>
            <p className="col-span-12 hidden text-[0.92rem] leading-relaxed text-current/70 sm:col-span-3 sm:block">
              {service.short}
            </p>
            <span className="col-span-1 text-right text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
