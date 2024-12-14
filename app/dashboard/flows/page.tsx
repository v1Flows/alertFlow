import FlowList from "@/components/dashboard/flows/list";
import ErrorCard from "@/components/error/ErrorCard";
import GetFlows from "@/lib/fetch/flow/all";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetProject from "@/lib/fetch/project/data";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardFlowsPage() {
  const flowsData = GetFlows();
  const projectsData = GetProjects();
  const settingsData = PageGetSettings();
  const planData = GetUserPlan();
  const userDetailsData = GetUserDetails();

  const [flows, projects, settings, plan, userDetails] = (await Promise.all([
    flowsData,
    projectsData,
    settingsData,
    planData,
    userDetailsData,
  ])) as any;

  // get members for each project
  if (projects.success) {
    for (let i = 0; i < projects.data.projects.length; i++) {
      const project = projects.data.projects[i];
      const projectData = await GetProject(project.id);

      if (projectData.success) {
        projects.data.projects[i].members = projectData.data.members;
      }
    }
  }

  return (
    <>
      {flows.success &&
      plan.success &&
      projects.success &&
      settings.success &&
      userDetails.success ? (
        <FlowList
          flows={flows.data.flows}
          plan={plan.data.plan}
          projects={projects.data.projects}
          settings={settings.data.settings}
          user={userDetails.data.user}
        />
      ) : (
        <ErrorCard
          error={
            flows.error ||
            plan.error ||
            projects.error ||
            settings.error ||
            userDetails.error
          }
          message={
            flows.message ||
            plan.message ||
            projects.message ||
            settings.message ||
            userDetails.message
          }
        />
      )}
    </>
  );
}
