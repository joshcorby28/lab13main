"use client";

import Link from "next/link";
import { services } from "@/content/services";
import { Reveal } from "@/components/animations/Reveal";

export function ServiceIndex() {
  return (
    <div className="border-t border-line">
      {services.map((service, index) => (
        <Reveal key={service.slug} delay={index * 0.03}>
          <Link
            href={`/services/${service.slug}`}
            data-cursor="OPEN"
            className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-7 transition-colors duration-500 hover:bg-void-2 sm:py-8"
          >
            <span className="eyebrow col-span-2 text-muted sm:col-span-1">
              {service.number}
            </span>
            <h3 className="display col-span-9 text-[clamp(1.45rem,3.1vw,2.5rem)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:col-span-6 lg:col-span-5">
              {service.title}
            </h3>
            <p className="col-span-12 hidden text-[0.92rem] leading-relaxed text-muted sm:col-span-4 sm:block lg:col-span-5">
              {service.short}
            </p>
            <span className="col-span-1 hidden text-right text-lg text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:text-paper sm:block">
              →
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
