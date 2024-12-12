import React from "react";

import AdminGetSettings from "@/lib/fetch/page/settings";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import SidebarMenu from "@/components/sidebar/sidebar-menu";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetProjects from "@/lib/fetch/project/all";
import GetFlows from "@/lib/fetch/flow/all";
import Footer from "@/components/footer/Footer";

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
      flows={flows}
      notifications={notifications}
      projects={projects.projects}
      settings={settings}
      user={userDetails}
    >
      {children}
      <Footer />
    </SidebarMenu>
  );
}
