import type { Metadata, Viewport } from "next";

import { cookies } from "next/headers";
import clsx from "clsx";
import React from "react";
import { Toaster } from "sonner";

import Footer from "@/components/footer/Footer";
import SidebarMenu from "@/components/sidebar/sidebar-menu";
import GetFlows from "@/lib/fetch/flow/all";
import AdminGetSettings from "@/lib/fetch/page/settings";
import GetProjects from "@/lib/fetch/project/all";
import GetUserDetails from "@/lib/fetch/user/getDetails";
import GetUserNotifications from "@/lib/fetch/user/getNotifications";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

import { Providers } from "./providers";

import "@/styles/globals.css";

const APP_NAME = siteConfig.name;
const APP_DEFAULT_TITLE = siteConfig.name;
const APP_TITLE_TEMPLATE = `%s - ${siteConfig.name}`;
const APP_DESCRIPTION = siteConfig.description;

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

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
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          defer
          data-domain="alertflow.org"
          src="https://analytics.alertflow.org/js/script.js"
        />
        <link href="/manifest.json" rel="manifest" />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Toaster richColors position="bottom-center" />
          <div className="relative flex h-screen flex-col">
            {sessionCookie ? (
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
            ) : (
              <>
                {children}
                <Footer />
              </>
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}
