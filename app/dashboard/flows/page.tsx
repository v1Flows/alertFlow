import FlowList from "@/components/dashboard/flows/list";
import GetFlows from "@/lib/fetch/flow/all";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardFlowsPage() {
  const flowsData = GetFlows();
  const projectsData = GetProjects();
  const settingsData = PageGetSettings();
  const planData = GetUserPlan();
  const userDetailsData = GetUserDetails();

  const [flows, projects, settings, plan, userDetails] = await Promise.all([
    flowsData,
    projectsData,
    settingsData,
    planData,
    userDetailsData,
  ]);

  return (
    <FlowList
      flows={flows}
      plan={plan}
      projects={projects.projects}
      settings={settings}
      user={userDetails}
    />
  );
}
