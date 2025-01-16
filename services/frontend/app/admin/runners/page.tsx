import { AlertflowRunnerList } from "@/components/admin/runners/alertflowList";
import { RunnersHeading } from "@/components/admin/runners/heading";
import { SelfHostedRunnerList } from "@/components/admin/runners/list";
import ErrorCard from "@/components/error/ErrorCard";
import AdminGetProjects from "@/lib/fetch/admin/projects";
import AdminGetRunners from "@/lib/fetch/admin/runners";
import AdminGetPageSettings from "@/lib/fetch/admin/settings";

export default async function AdminRunnersPage() {
  const runnersData = AdminGetRunners();
  const projectsData = AdminGetProjects();
  const settingsData = AdminGetPageSettings();

  const [runners, projects, settings] = (await Promise.all([
    runnersData,
    projectsData,
    settingsData,
  ])) as any;

  return (
    <>
      <RunnersHeading />
      {runners.success && projects.success ? (
        <>
          <SelfHostedRunnerList
            projects={projects.data.projects}
            runners={runners.data.self_hosted_runners}
          />
          <div className="mt-4">
            <AlertflowRunnerList
              runners={runners.data.alertflow_runners}
              settings={settings.data.settings}
            />
          </div>
        </>
      ) : (
        <ErrorCard
          error={runners.error || projects.error || settings.error}
          message={runners.message || projects.message || settings.message}
        />
      )}
    </>
  );
}
