"use client";

import { Icon } from "@iconify/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  ScrollShadow,
  Spacer,
  useDisclosure,
} from "@heroui/react";
import { useIsSSR } from "@react-aria/ssr";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useMediaQuery } from "usehooks-ts";

import { useSidebarStore } from "@/store/useSidebarStore";
import { Logout } from "@/lib/logout";
import Notifications from "@/components/notifications/notifications";

import Search from "../search/search";
import { ThemeSwitch } from "../theme-switch";

import Sidebar from "./sidebar";
import { sectionAdminItems, sectionItems } from "./sidebar-items";

/**
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */
export default function SidebarMenu({
  children,
  user,
  settings,
  notifications,
  projects,
  flows,
}: {
  children: React.ReactNode;
  user: any;
  settings: any;
  notifications: any;
  projects: any;
  flows: any;
}) {
  const router = useRouter();

  const { theme } = useTheme();
  const isSSR = useIsSSR();
  const pathname = usePathname();
  const currentPath = pathname.split("/")?.[1];

  const { isCollapsed, isLoading, toggleCollapsed } = useSidebarStore();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCompact = isCollapsed || isMobile;

  const notificationsDrawer = useDisclosure();

  const onToggle = React.useCallback(() => {
    toggleCollapsed();
  }, [toggleCollapsed]);

  async function LogoutHandler() {
    await Logout();
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex h-dvh w-full">
      <div
        className={cn(
          "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
          {
            "w-16 items-center px-2 py-6": isCompact,
          },
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 px-3",

            {
              "justify-center gap-0": isCompact,
            },
          )}
        >
          <div className="flex size-8 items-center justify-center rounded-full">
            <Image
              alt="Logo"
              height={32}
              radius="none"
              shadow="none"
              src={`/images/af_logo_${theme === "light" || isSSR ? "black" : "white"}.png`}
              width={32}
            />
          </div>
          <span
            className={cn("text-small font-bold opacity-100", {
              "w-0 opacity-0": isCompact,
            })}
          >
            AlertFlow
          </span>
        </div>
        <Spacer y={8} />
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-3 px-3 hover:cursor-pointer">
              <Avatar
                isBordered
                color={
                  user.role === "admin"
                    ? "danger"
                    : user.role === "vip"
                      ? "warning"
                      : "primary"
                }
                name={user.username}
                radius="sm"
                size="sm"
              />
              {!isCompact && (
                <div className="flex flex-col">
                  <p className="text-small font-medium text-default-600">
                    {user.username}{" "}
                    {user.role === "admin" && (
                      <span className="text-danger">(Admin)</span>
                    )}
                    {user.role === "vip" && (
                      <span className="text-warning">(VIP)</span>
                    )}
                  </p>
                  <p className="text-tiny text-default-400">{user.email}</p>
                </div>
              )}
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              showDivider
              description="View and edit your profile"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:face-scan-square-linear"
                  width={24}
                />
              }
              onPress={() => router.push(`/profile`)}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              description="Logout from your account"
              startContent={
                <Icon
                  className="text-danger"
                  icon="solar:logout-3-linear"
                  width={24}
                />
              }
              onPress={LogoutHandler}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <div className="flex items-center justify-center">
            <Search
              flows={flows}
              isCollapsed={isCollapsed}
              projects={projects}
            />
          </div>
          <Spacer y={2} />

          <Sidebar
            ref={null}
            defaultSelectedKey="home"
            isCompact={isCompact}
            items={user.role === "admin" ? sectionAdminItems : sectionItems}
            selectedKeys={[currentPath]}
          />
        </ScrollShadow>

        <Spacer y={2} />

        {user.role === "admin" && settings.maintenance && (
          <Card
            isBlurred
            className="h-[80px] border-3 border-danger"
            shadow="sm"
          >
            <CardBody className="items-center text-center">
              <div className="flex items-center justify-center space-x-2 font-bold text-danger">
                <Icon icon="solar:danger-triangle-broken" width={20} />
                {!isCompact && <p className="text-md">Maintenance Active</p>}
              </div>
            </CardBody>
          </Card>
        )}

        <Spacer y={8} />
        <div
          className={cn("flex flex-cols items-center justify-center gap-4", {
            "flex-col gap-2": isCompact,
          })}
        >
          <ThemeSwitch />

          <Button
            disableRipple
            isIconOnly
            className="overflow-visible"
            radius="full"
            variant="light"
            onPress={notificationsDrawer.onOpen}
          >
            {notifications.filter((n: any) => !n.is_read).length > 0 ? (
              <Badge
                color="danger"
                content={notifications.filter((n: any) => !n.is_read).length}
                showOutline={false}
                size="md"
              >
                <Icon
                  className="text-default-500"
                  icon="solar:bell-bold-duotone"
                  width={22}
                />
              </Badge>
            ) : (
              <Icon
                className="text-default-500"
                icon="solar:bell-off-bold-duotone"
                width={22}
              />
            )}
          </Button>

          <Notifications
            disclosure={notificationsDrawer}
            incNotifications={notifications}
          />

          <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:sidebar-minimalistic-outline"
              width={24}
            />
          </Button>
        </div>

        <Spacer y={2} />

        {!isCompact && (
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-default-600">Powered by</span>
            <p className="text-sm font-bold text-primary">JustLab</p>
            <p className="text-sm text-default-600">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        )}
      </div>

      <div className="w-full flex-1 flex-col overflow-y-auto p-4">
        <main className="size-full overflow-visible">{children}</main>
      </div>
    </div>
  );
}
