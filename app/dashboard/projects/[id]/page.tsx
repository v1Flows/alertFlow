import Project from "@/components/dashboard/projects/project";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjectApiKeys from "@/lib/fetch/project/tokens";
import GetProjectAuditLogs from "@/lib/fetch/project/audit";
import GetProject from "@/lib/fetch/project/data";
import GetProjectRunners from "@/lib/fetch/project/runners";
import GetUserPlan from "@/lib/fetch/user/getPlan";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetFlows from "@/lib/fetch/flow/all";

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
    await Promise.all([
      settingsData,
      projectData,
      runnersData,
      tokensData,
      planData,
      auditData,
      userDetailsData,
      flowsData,
    ]);

  return (
    <Project
      audit={audit}
      flows={flows}
      members={project.members}
      plan={plan}
      project={project.project}
      runners={runners}
      settings={settings}
      tokens={tokens}
      user={userDetails}
    />
  );
}
