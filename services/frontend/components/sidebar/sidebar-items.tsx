import type { SidebarItem } from "./sidebar";

/**
 * Please check the https://nextui.org/docs/guide/routing to have a seamless router integration
 */

export const sectionItems: SidebarItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    items: [
      {
        key: "",
        href: "/",
        icon: "hugeicons:home-12",
        title: "Home",
      },
      {
        key: "alerts",
        href: "/alerts",
        icon: "hugeicons:alert-02",
        title: "Alerts",
      },
      {
        key: "projects",
        href: "/projects",
        icon: "hugeicons:ai-folder-01",
        title: "Projects",
      },
      {
        key: "flows",
        href: "/flows",
        icon: "hugeicons:workflow-square-10",
        title: "Flows",
      },
    ],
  },
];

export const sectionAdminItems: SidebarItem[] = [
  ...sectionItems,
  {
    key: "admin",
    title: "Admin",
    items: [
      {
        key: "admin_stats",
        href: "/admin/stats",
        icon: "hugeicons:chart-line-data-01",
        title: "Stats",
      },
      {
        key: "admin_users",
        href: "/admin/users",
        icon: "hugeicons:location-user-02",
        title: "Users",
      },
      {
        key: "admin_alerts",
        href: "/admin/alerts",
        icon: "hugeicons:alert-02",
        title: "Alerts",
      },
      {
        key: "admin_projects",
        href: "/admin/projects",
        icon: "hugeicons:ai-folder-01",
        title: "Projects",
      },
      {
        key: "admin_flows",
        href: "/admin/flows",
        icon: "hugeicons:workflow-square-10",
        title: "Flows",
      },
      {
        key: "admin_runners",
        href: "/admin/runners",
        icon: "hugeicons:ai-brain-04",
        title: "Runners",
      },
      {
        key: "admin_executions",
        href: "/admin/executions",
        icon: "hugeicons:rocket-02",
        title: "Executions",
      },
      {
        key: "admin_tokens",
        href: "/admin/tokens",
        icon: "hugeicons:key-02",
        title: "Tokens",
      },
      {
        key: "admin_settings",
        href: "/admin/settings",
        icon: "hugeicons:settings-02",
        title: "Settings",
      },
    ],
  },
];
