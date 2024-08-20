import { cookies } from "next/headers";

import { ProjectsList } from "@/components/dashboard/projects/list";
import PageGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserPlan from "@/lib/fetch/user/getPlan";

export default async function DashboardProjectsPage() {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  const projects = await GetProjects();
  const settings = await PageGetSettings();
  const plan = await GetUserPlan();
  const userDetails = await GetUserDetails(user.id);

  return (
    <>
      <ProjectsList
        pending_projects={projects.pending_projects}
        plan={plan}
        projects={projects.projects}
        settings={settings}
        user={userDetails}
      />
    </>
  );
}
