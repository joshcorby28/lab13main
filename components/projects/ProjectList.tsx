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
