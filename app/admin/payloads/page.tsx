import { PayloadsList } from "@/components/admin/payloads/list";
import AdminGetExecutions from "@/lib/fetch/admin/executions";
import AdminGetFlows from "@/lib/fetch/admin/flows";
import AdminGetPayloads from "@/lib/fetch/admin/payloads";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminPayloadsPage() {
  const flows = await AdminGetFlows();
  const runners = await AdminGetRunners();
  const payloads = await AdminGetPayloads();
  const executions = await AdminGetExecutions();

  const combined_runners = [
    ...runners.alertflow_runners,
    ...runners.self_hosted_runners,
  ];

  return (
    <>
      <PayloadsList
        executions={executions}
        flows={flows}
        payloads={payloads}
        runners={combined_runners}
      />
    </>
  );
}
