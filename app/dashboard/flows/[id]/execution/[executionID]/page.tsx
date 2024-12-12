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
  const flowData = GetFlow(params.id);
  const executionData = GetExecution(params.executionID);
  const settingsData = PageGetSettings();
  const userDetailsData = GetUserDetails();

  const [flow, execution, settings, userDetails] = await Promise.all([
    flowData,
    executionData,
    settingsData,
    userDetailsData,
  ]);

  const runnersData = GetProjectRunners(flow.project_id);
  const runners = await runnersData;

  return (
    <Execution
      execution={execution}
      flow={flow}
      runners={runners}
      settings={settings}
      userDetails={userDetails}
    />
  );
}
