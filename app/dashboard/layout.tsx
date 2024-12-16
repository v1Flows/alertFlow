import React from "react";

import Footer from "@/components/footer/Footer";
import SidebarMenu from "@/components/sidebar/sidebar-menu";
import GetFlows from "@/lib/fetch/flow/all";
import AdminGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";

export default async function DashboardHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsData = AdminGetSettings();
  const notificationsData = GetUserNotifications();
  const userDetailsData = GetUserDetails();
  const projectsData = GetProjects();
  const flowsData = GetFlows();

  const [settings, notifications, userDetails, projects, flows] =
    await Promise.all([
      settingsData,
      notificationsData,
      userDetailsData,
      projectsData,
      flowsData,
    ]);

  return (
    <SidebarMenu
      flows={flows.success ? flows.data.flows : []}
      notifications={
        notifications.success ? notifications.data.notifications : []
      }
      projects={projects.success ? projects.data.projects : []}
      settings={settings.success ? settings.data.settings : {}}
      user={userDetails.success ? userDetails.data.user : {}}
    >
      {children}
      <Footer />
    </SidebarMenu>
  );
}
