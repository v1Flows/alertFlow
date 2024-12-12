import ProjectsHeading from "@/components/dashboard/projects/heading";
import { ProjectsList } from "@/components/dashboard/projects/list";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardProjectsPage() {
  const projectsData = GetProjects();
  const settingsData = PageGetSettings();
  const planData = GetUserPlan();
  const userDetailsData = GetUserDetails();

  const [projects, settings, plan, userDetails] = await Promise.all([
    projectsData,
    settingsData,
    planData,
    userDetailsData,
  ]);

  return (
    <main>
      <ProjectsHeading />
      <ProjectsList
        pending_projects={projects.pending_projects}
        plan={plan}
        projects={projects.projects}
        settings={settings}
        user={userDetails}
      />
    </main>
  );
}
