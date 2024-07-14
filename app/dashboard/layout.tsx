import React from "react";
import { cookies } from "next/headers";

import Navbar from "@/components/navbar";
import AdminGetSettings from "@/lib/fetch/page/settings";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";

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
    <>
      <Navbar
        notifications={notifications}
        session={session}
        settings={settings}
        user={user}
      />
      <main className="container mx-auto max-w-7xl pt-2 px-6 flex-grow">
        {children}
      </main>
    </>
  );
}
