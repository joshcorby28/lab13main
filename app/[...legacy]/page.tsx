import { permanentRedirect } from "next/navigation";

export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export default function LegacyPage() {
  permanentRedirect("/");
}
