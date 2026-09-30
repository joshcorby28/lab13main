import Link from "next/link";
import type { Project } from "@/content/projects";
import { WorkIndex } from "@/components/projects/WorkIndex";

export function ProjectList({
  projects,
  numbered = true,
}: {
  projects: Project[];
  numbered?: boolean;
}) {
  return <WorkIndex projects={projects} numbered={numbered} />;
}

export function ProjectListLegacyNote() {
  return (
    <p className="sr-only">
      <Link href="/work">Work index</Link>
    </p>
  );
}
