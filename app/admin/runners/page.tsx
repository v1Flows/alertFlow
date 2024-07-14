import { AlertflowRunnerList } from "@/components/admin/runners/alertflowList";
import { RunnersHeading } from "@/components/admin/runners/heading";
import { SelfHostedRunnerList } from "@/components/admin/runners/list";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminRunnersPage() {
  const runners = await AdminGetRunners();
  const projects = await AdminGetProjects();

  return (
    <>
      <RunnersHeading />
      <SelfHostedRunnerList
        projects={projects.projects}
        runners={runners.self_hosted_runners}
      />
      <div className="mt-4">
        <AlertflowRunnerList runners={runners.alertflow_runners} />
      </div>
    </>
  );
}
