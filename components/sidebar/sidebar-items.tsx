import { type SidebarItem } from "./sidebar";

/**
 * Please check the https://nextui.org/docs/guide/routing to have a seamless router integration
 */

export const sectionItems: SidebarItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    items: [
      {
        key: "dashboard",
        href: "/dashboard",
        icon: "solar:home-smile-outline",
        title: "Home",
      },
      {
        key: "dashboard_projects",
        href: "/dashboard/projects",
        icon: "solar:inbox-archive-outline",
        title: "Projects",
      },
      {
        key: "dashboard_flows",
        href: "/dashboard/flows",
        icon: "solar:book-2-outline",
        title: "Flows",
      },
    ],
  },
  {
    key: "help_center",
    title: "Informations & Help",
    items: [
      {
        key: "dashboard_docs",
        href: "/dashboard/docs",
        icon: "solar:notes-outline",
        title: "Documentation",
      },
      {
        key: "dashboard_docs_api",
        href: "/dashboard",
        icon: "solar:notebook-outline",
        title: "API",
      },
      {
        key: "help",
        href: "/dashboard",
        icon: "solar:incoming-call-rounded-outline",
        title: "Support",
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
        key: "admin_plans",
        href: "/admin/plans",
        icon: "solar:planet-outline",
        title: "Plans",
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
