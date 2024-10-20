import React from "react";

import AdminGetSettings from "@/lib/fetch/page/settings";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import SidebarMenu from "@/components/sidebar/sidebar-menu";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetProjects from "@/lib/fetch/project/all";
import GetFlows from "@/lib/fetch/flow/all";

export default async function DashboardHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await AdminGetSettings();
  const notifications = await GetUserNotifications();
  const userDetails = await GetUserDetails();
  const projects = await GetProjects();
  const flows = await GetFlows();

  return (
    <SidebarMenu
      flows={flows}
      notifications={notifications}
      projects={projects.projects}
      settings={settings}
      user={userDetails}
    >
      {children}
    </SidebarMenu>
  );
}
