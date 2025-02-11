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
        icon: "solar:home-smile-outline",
        title: "Home",
      },
      {
        key: "projects",
        href: "/projects",
        icon: "solar:inbox-archive-outline",
        title: "Projects",
      },
      {
        key: "flows",
        href: "/flows",
        icon: "solar:book-2-outline",
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
        icon: "solar:chart-2-outline",
        title: "Stats",
      },
      {
        key: "admin_users",
        href: "/admin/users",
        icon: "solar:smile-square-outline",
        title: "Users",
      },
      {
        key: "admin_projects",
        href: "/admin/projects",
        icon: "solar:inbox-archive-outline",
        title: "Projects",
      },
      {
        key: "admin_flows",
        href: "/admin/flows",
        icon: "solar:book-2-outline",
        title: "Flows",
      },
      {
        key: "admin_runners",
        href: "/admin/runners",
        icon: "solar:rocket-2-outline",
        title: "Runners",
      },
      {
        key: "admin_payloads",
        href: "/admin/payloads",
        icon: "solar:letter-opened-outline",
        title: "Payloads",
      },
      {
        key: "admin_executions",
        href: "/admin/executions",
        icon: "solar:reorder-linear",
        title: "Executions",
      },
      {
        key: "admin_tokens",
        href: "/admin/tokens",
        icon: "solar:key-square-2-outline",
        title: "Tokens",
      },
      {
        key: "admin_settings",
        href: "/admin/settings",
        icon: "solar:settings-outline",
        title: "Settings",
      },
    ],
  },
];
