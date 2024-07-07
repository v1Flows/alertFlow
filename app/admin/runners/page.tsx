import { AlertflowRunnerList } from "@/components/admin/runners/alertflowList";
import { RunnersHeading } from "@/components/admin/runners/heading";
import { SelfHostedRunnerList } from "@/components/admin/runners/list";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminRunnersPage() {
  const runners = await AdminGetRunners();

  return (
    <>
      <RunnersHeading />
      <SelfHostedRunnerList runners={runners.self_hosted_runners} />
      <div className="mt-4">
        <AlertflowRunnerList runners={runners.alertflow_runners} />
      </div>
    </>
  );
}
