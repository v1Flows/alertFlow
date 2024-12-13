import { PayloadsList } from "@/components/admin/payloads/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetExecutions from "@/lib/fetch/admin/executions";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetPayloads from "@/lib/fetch/admin/payloads";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminPayloadsPage() {
  const flowsData = AdminGetFlows();
  const runnersData = AdminGetRunners();
  const payloadsData = AdminGetPayloads();
  const executionsData = AdminGetExecutions();

  const [flows, runners, payloads, executions] = (await Promise.all([
    flowsData,
    runnersData,
    payloadsData,
    executionsData,
  ])) as any;

  return (
    <>
      {flows.success &&
      runners.success &&
      payloads.success &&
      executions.success ? (
        <PayloadsList
          executions={executions.data.executions}
          flows={flows.data.flows}
          payloads={payloads.data.payloads}
          runners={[
            ...runners.data.self_hosted_runners,
            ...runners.data.alertflow_runners,
          ]}
        />
      ) : (
        <ErrorCard
          error={
            flows.error || runners.error || payloads.error || executions.error
          }
          message={
            flows.message ||
            runners.message ||
            payloads.message ||
            executions.message
          }
        />
      )}
    </>
  );
}
