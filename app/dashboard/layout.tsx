import React from "react";

import AdminGetSettings from "@/lib/fetch/page/settings";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import SidebarMenu from "@/components/sidebar/sidebar-menu";
import GetUserDetails from "@/lib/fetch/user/getDetails";

export default async function DashboardHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await AdminGetSettings();
  const notifications = await GetUserNotifications();
  const userDetails = await GetUserDetails();

  return (
    <SidebarMenu
      notifications={notifications}
      settings={settings}
      user={userDetails}
    >
      {children}
    </SidebarMenu>
  );
}
