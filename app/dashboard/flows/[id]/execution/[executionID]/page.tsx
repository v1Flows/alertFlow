import { Execution } from "@/components/dashboard/flows/flow/execution/execution";
import GetFlowExecution from "@/lib/fetch/flow/execution";
import GetFlow from "@/lib/fetch/flow/flow";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjectRunners from "@/lib/fetch/project/runners";

export default async function DashboardExecutionPage({
  params,
}: {
  params: { id: string; executionID: string };
}) {
  const flow = await GetFlow(params.id);
  const execution = await GetFlowExecution(params.id, params.executionID);
  const runners = await GetProjectRunners(flow.project_id);
  const settings = await PageGetSettings();

  return (
    <>
      <Execution
        execution={execution}
        flow={flow}
        runners={runners}
        settings={settings}
      />
    </>
  );
}
