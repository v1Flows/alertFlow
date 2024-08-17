import { Flow } from "@/components/dashboard/flows/flow";
import GetFlowExecutions from "@/lib/fetch/flow/executions";
import GetFlow from "@/lib/fetch/flow/flow";
import GetFlowPayloads from "@/lib/fetch/flow/payloads";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetProjectRunners from "@/lib/fetch/project/runners";

export default async function DashboardFlowPage({
  params,
}: {
  params: { id: string };
}) {
  const projects = await GetProjects();
  const flow = await GetFlow(params.id);
  const executions = await GetFlowExecutions(params.id);
  const payloads = await GetFlowPayloads(params.id);
  const runners = await GetProjectRunners(flow.flow.project_id);
  const settings = await PageGetSettings();

  return (
    <>
      <Flow
        actions={flow.actions}
        executions={executions}
        flow={flow.flow}
        id={params.id}
        payloads={payloads}
        projects={projects.projects}
        runners={runners}
        settings={settings}
      />
    </>
  );
}
