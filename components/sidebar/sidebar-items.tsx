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
        icon: "solar:clipboard-text-broken",
        title: "Home",
      },
      {
        key: "dashboard_projects",
        href: "/dashboard/projects",
        icon: "solar:box-broken",
        title: "Projects",
      },
      {
        key: "dashboard_flows",
        href: "/dashboard/flows",
        icon: "solar:book-bookmark-broken",
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
        icon: "solar:notes-broken",
        title: "Documentation",
      },
      {
        key: "dashboard_docs_api",
        href: "/dashboard/docs/api",
        icon: "solar:notebook-broken",
        title: "API",
      },
      {
        key: "dashboard_roadmap",
        href: "/dashboard/roadmap",
        icon: "solar:routing-2-outline",
        title: "Roadmap",
      },
      {
        key: "help",
        href: "/help",
        icon: "solar:incoming-call-rounded-broken",
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
        icon: "solar:chart-2-broken",
        title: "Stats",
      },
      {
        key: "admin_users",
        href: "/admin/users",
        icon: "solar:smile-square-broken",
        title: "Users",
      },
      {
        key: "admin_projects",
        href: "/admin/projects",
        icon: "solar:box-broken",
        title: "Projects",
      },
      {
        key: "admin_flows",
        href: "/admin/flows",
        icon: "solar:book-bookmark-broken",
        title: "Flows",
      },
      {
        key: "admin_runners",
        href: "/admin/runners",
        icon: "solar:rocket-2-broken",
        title: "Runners",
      },
      {
        key: "admin_payloads",
        href: "/admin/payloads",
        icon: "solar:letter-opened-broken",
        title: "Payloads",
      },
      {
        key: "admin_executions",
        href: "/admin/executions",
        icon: "solar:reorder-line-duotone",
        title: "Executions",
      },
      {
        key: "admin_tokens",
        href: "/admin/tokens",
        icon: "solar:key-square-2-broken",
        title: "Tokens",
      },
      {
        key: "admin_plans",
        href: "/admin/plans",
        icon: "solar:planet-broken",
        title: "Plans",
      },
      {
        key: "admin_settings",
        href: "/admin/settings",
        icon: "solar:settings-broken",
        title: "Settings",
      },
    ],
  },
];
