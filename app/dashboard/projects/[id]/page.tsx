import Project from "@/components/dashboard/projects/project";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjectApiKeys from "@/lib/fetch/project/tokens";
import GetProjectAuditLogs from "@/lib/fetch/project/audit";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetUserPlan from "@/lib/fetch/user/getPlan";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetFlows from "@/lib/fetch/flow/all";
import ErrorCard from "@/components/error/ErrorCard";

export default async function DashboardProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const settingsData = PageGetSettings();
  const projectData = GetProject(params.id);
  const runnersData = GetProjectRunners(params.id);
  const tokensData = GetProjectApiKeys(params.id);
  const planData = GetUserPlan();
  const auditData = GetProjectAuditLogs(params.id);
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
