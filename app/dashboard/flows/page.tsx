import FlowList from "@/components/dashboard/flows/list";
import GetFlows from "@/lib/fetch/flow/all";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardFlowsPage() {
  const flows = await GetFlows();
  const projects = await GetProjects();
  const settings = await PageGetSettings();
  const plan = await GetUserPlan();

  return (
    <main>
      <FlowList
        flows={flows}
        plan={plan}
        projects={projects.projects}
        settings={settings}
      />
    </main>
  );
}
