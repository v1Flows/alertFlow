import FlowList from "@/components/dashboard/flows/list";
import GetFlows from "@/lib/fetch/flow/all";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";

export default async function DashboardFlowsPage() {
  const flows = await GetFlows();
  const projects = await GetProjects();
  const settings = await PageGetSettings();

  return (
    <main>
      <FlowList
        flows={flows}
        projects={projects.projects}
        settings={settings}
      />
    </main>
  );
}
