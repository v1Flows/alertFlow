import { Flow } from "@/components/dashboard/flows/flow";
import ErrorCard from "@/components/error/ErrorCard";
import GetFlowExecutions from "@/lib/fetch/flow/executions";
import GetFlow from "@/lib/fetch/flow/flow";
import GetFlowPayloads from "@/lib/fetch/flow/payloads";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardFlowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projectsData = GetProjects();
  const flowData = GetFlow(id);
  const executionsData = GetFlowExecutions(id);
  const payloadsData = GetFlowPayloads(id);
  const settingsData = PageGetSettings();
  const userDetailsData = GetUserDetails();

  const [projects, flow, executions, payloads, settings, userDetails] =
    (await Promise.all([
      projectsData,
      flowData,
      executionsData,
      payloadsData,
      settingsData,
      userDetailsData,
    ])) as any;

  let runnersData;
  let projectdata;

  if (flow.success) {
    runnersData = GetProjectRunners(flow.data.flow.project_id);
    projectdata = GetProject(flow.data.flow.project_id);
  }

  const [runners, project] = (await Promise.all([
    runnersData,
    projectdata,
  ])) as any;

  return (
    <>
      {executions.success &&
      flow.success &&
      payloads.success &&
      projects.success &&
      project.success &&
      runners.success &&
      settings.success &&
      userDetails.success ? (
        <Flow
          executions={executions.data.executions}
          flow={flow.data.flow}
          id={id}
          members={project.data.members}
          payloads={payloads.data.payloads}
          project={project.data.project}
          projects={projects.data.projects}
          runners={runners.data.runners}
          settings={settings.data.settings}
          user={userDetails.data.user}
        />
      ) : (
        <ErrorCard
          error={
            executions.error ||
            flow.error ||
            payloads.error ||
            projects.error ||
            runners.error ||
            project.error ||
            settings.error ||
            userDetails.error
          }
          message={
            executions.message ||
            flow.message ||
            payloads.message ||
            projects.message ||
            runners.message ||
            project.message ||
            settings.message ||
            userDetails.message
          }
        />
      )}
    </>
  );
}
