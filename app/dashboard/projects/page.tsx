import { ProjectsList } from "@/components/dashboard/projects/list";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardProjectsPage() {
  const projects = await GetProjects();
  const settings = await PageGetSettings();
  const plan = await GetUserPlan();

  return (
    <>
      <ProjectsList
        pending_projects={projects.pending_projects}
        plan={plan}
        projects={projects.projects}
        settings={settings}
      />
    </>
  );
}
