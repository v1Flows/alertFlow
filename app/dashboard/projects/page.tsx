import { ProjectsList } from "@/components/dashboard/projects/list";
import GetProjects from "@/lib/fetch/project/all";

export default async function DashboardProjectsPage() {
  const projects = await GetProjects();

  return (
    <>
      <ProjectsList projects={projects} />
    </>
  );
}
