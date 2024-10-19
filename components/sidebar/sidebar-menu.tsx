"use client";

import React from "react";
import {
  Avatar,
  Button,
  Spacer,
  useDisclosure,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  ScrollShadow,
  cn,
  Kbd,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

import NotificationsCard from "@/components/notifications/notifications";
import { Logout } from "@/lib/logout";

import { ThemeSwitch } from "../theme-switch";

import { sectionAdminItems, sectionItems } from "./sidebar-items";
import Sidebar from "./sidebar";

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
}: {
  children: React.ReactNode;
  user: any;
  settings: any;
  notifications: any;
}) {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme } = useTheme();
  const isSSR = useIsSSR();
  const pathname = usePathname();
  const currentPath1 = pathname.split("/")?.[1];
  const currentPath2 = pathname.split("/")?.[2];
  const currentPath = currentPath2
    ? `${currentPath1}_${currentPath2}`
    : currentPath1;

  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  async function LogoutHandler() {
    await Logout();
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
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
                  user.role === "Admin"
                    ? "danger"
                    : user.role === "VIP"
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
                    {user.role === "Admin" && (
                      <span className="text-danger">(Admin)</span>
                    )}
                    {user.role === "VIP" && (
                      <span className="text-warning">(VIP)</span>
                    )}
                  </p>
                  <p className="text-tiny text-default-400">{user.email}</p>
                </div>
              )}
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            className="w-[210px] bg-content1 px-[8px] py-[8px]"
            variant="flat"
          >
            <DropdownItem
              key="profile"
              showDivider
              onPress={() => router.push(`/profile`)}
            >
              Settings
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={LogoutHandler}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <div className="flex items-center justify-center">
            {!isCompact ? (
              <Button
                fullWidth
                radius="sm"
                startContent={<Icon icon="solar:magnifer-linear" width={16} />}
                variant="flat"
              >
                <div className="flex flex-cols items-center justify-between gap-4">
                  <p className="text-default-500">Search</p>
                  <Kbd keys={["command"]}>K</Kbd>
                </div>
              </Button>
            ) : (
              <Button
                isIconOnly
                radius="sm"
                startContent={<Icon icon="solar:magnifer-linear" width={16} />}
                variant="flat"
              />
            )}
          </div>

          <Sidebar
            defaultSelectedKey="home"
            isCompact={isCompact}
            items={user.role === "Admin" ? sectionAdminItems : sectionItems}
            selectedKeys={[currentPath]}
          />
        </ScrollShadow>

        <Spacer y={2} />

        {user.role === "Admin" && settings.maintenance && (
          <Card
            isBlurred
            className="border-3 border-danger h-[80px]"
            shadow="sm"
          >
            <CardBody className="items-center text-center">
              <div className="flex items-center justify-center text-danger font-bold space-x-2">
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

          <Popover offset={12} placement="bottom">
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className="overflow-visible"
                radius="full"
                variant="light"
              >
                {notifications.filter((n: any) => !n.is_read).length > 0 ? (
                  <Badge
                    color="danger"
                    content={
                      notifications.filter((n: any) => !n.is_read).length
                    }
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
            </PopoverTrigger>
            <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
              <NotificationsCard
                // @ts-ignore
                className="w-full shadow-none"
                incNotifications={notifications}
              />
            </PopoverContent>
          </Popover>

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
            <p className="text-sm text-primary font-bold">JustLab</p>
            <p className="text-sm text-default-600">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        )}
      </div>

      <div className="w-full flex-1 flex-col p-4 overflow-y-auto">
        <main className="h-full w-full overflow-visible">{children}</main>
      </div>
    </div>
  );
}
