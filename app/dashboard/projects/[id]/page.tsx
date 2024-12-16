import Project from "@/components/dashboard/projects/project";
import ErrorCard from "@/components/error/ErrorCard";
import GetFlows from "@/lib/fetch/flow/all";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjectAuditLogs from "@/lib/fetch/project/audit";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetProjectApiKeys from "@/lib/fetch/project/tokens";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const settingsData = PageGetSettings();
  const projectData = GetProject(id);
  const runnersData = GetProjectRunners(id);
  const tokensData = GetProjectApiKeys(id);
  const planData = GetUserPlan();
  const auditData = GetProjectAuditLogs(id);
  const userDetailsData = GetUserDetails();
  const flowsData = GetFlows();

  const [settings, project, runners, tokens, plan, audit, userDetails, flows] =
    (await Promise.all([
      settingsData,
      projectData,
      runnersData,
      tokensData,
      planData,
      auditData,
      userDetailsData,
      flowsData,
    ])) as any;

  return (
    <>
      {audit.success &&
      flows.success &&
      project.success &&
      plan.success &&
      runners.success &&
      settings.success &&
      tokens.success &&
      userDetails.success ? (
        <Project
          audit={audit.data.audit}
          flows={flows.data.flows}
          members={project.data.members}
          plan={plan.data.plan}
          project={project.data.project}
          runners={runners.data.runners}
          settings={settings.data.settings}
          tokens={tokens.data.tokens}
          user={userDetails.data.user}
        />
      ) : (
        <ErrorCard
          error={
            audit.error ||
            flows.error ||
            project.error ||
            plan.error ||
            runners.error ||
            settings.error ||
            tokens.error ||
            userDetails.error
          }
          message={
            audit.message ||
            flows.message ||
            project.message ||
            plan.message ||
            runners.message ||
            settings.message ||
            tokens.message ||
            userDetails.message
          }
        />
      )}
    </>
  );
}
