import { ProjectsList } from "@/components/dashboard/projects/list";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";

export default async function DashboardProjectsPage() {
  const projects = await GetProjects();
  const settings = await PageGetSettings();

  return (
    <>
      <ProjectsList
        pending_projects={projects.pending_projects}
        projects={projects.projects}
        settings={settings}
      />
    </>
  );
}
