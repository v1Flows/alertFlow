import { Flow } from "@/components/dashboard/flows/flow";
import GetFlowExecutions from "@/lib/fetch/flow/executions";
import GetFlow from "@/lib/fetch/flow/flow";
import GetFlowPayloads from "@/lib/fetch/flow/payloads";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardFlowPage({
  params,
}: {
  params: { id: string };
}) {
  const projectsData = GetProjects();
  const flowData = GetFlow(params.id);
  const executionsData = GetFlowExecutions(params.id);
  const payloadsData = GetFlowPayloads(params.id);
  const settingsData = PageGetSettings();
  const userDetailsData = GetUserDetails();

  const [projects, flow, executions, payloads, settings, userDetails] =
    await Promise.all([
      projectsData,
      flowData,
      executionsData,
      payloadsData,
      settingsData,
      userDetailsData,
    ]);

  const runnersData = GetProjectRunners(flow.project_id);
  const runners = await runnersData;

  return (
    <Flow
      executions={executions}
      flow={flow}
      id={params.id}
      payloads={payloads}
      projects={projects.projects}
      runners={runners}
      settings={settings}
      user={userDetails}
    />
  );
}
