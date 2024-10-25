import { Execution } from "@/components/dashboard/flows/flow/execution/execution";
import GetExecution from "@/lib/fetch/executions/execution";
import GetFlow from "@/lib/fetch/flow/flow";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardExecutionPage({
  params,
}: {
  params: { id: string; executionID: string };
}) {
  const flow = await GetFlow(params.id);
  const execution = await GetExecution(params.executionID);
  const runners = await GetProjectRunners(flow.project_id);
  const settings = await PageGetSettings();
  const userDetails = await GetUserDetails();

  return (
    <>
      <Execution
        execution={execution}
        flow={flow}
        runners={runners}
        settings={settings}
        userDetails={userDetails}
      />
    </>
  );
}
