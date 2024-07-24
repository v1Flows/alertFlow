import React from "react";
import { cookies } from "next/headers";

import AdminGetSettings from "@/lib/fetch/page/settings";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import SidebarMenu from "@/components/sidebar/sidebar-menu";

export default async function DashboardHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = JSON.parse(cookies().get("user")?.value || "{}");
  const session = cookies().get("session")?.value;
  const settings = await AdminGetSettings();
  const notifications = await GetUserNotifications(user.id);

  return (
    <SidebarMenu
      notifications={notifications}
      session={session}
      settings={settings}
      user={user}
    >
      {children}
    </SidebarMenu>
  );
}
