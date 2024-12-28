import { AlertflowRunnerList } from "@/components/admin/runners/alertflowList";
import { RunnersHeading } from "@/components/admin/runners/heading";
import { SelfHostedRunnerList } from "@/components/admin/runners/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";

export default async function AdminRunnersPage() {
  const runnersData = AdminGetRunners();
  const projectsData = AdminGetProjects();

  const [runners, projects2] = (await Promise.all([
    runnersData,
    projectsData,
  ])) as any;

  return (
    <>
      <RunnersHeading />
      {runners.success && projects2.success ? (
        <>
          <SelfHostedRunnerList
            projects={projects2.data.projects}
            runners={runners.data.self_hosted_runners}
          />
          <div className="mt-4">
            <AlertflowRunnerList runners={runners.data.alertflow_runners} />
          </div>
        </>
      ) : (
        <ErrorCard
          error={runners.error || projects2.error}
          message={runners.message || projects2.message}
        />
      )}
    </>
  );
}
