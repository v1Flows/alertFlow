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
  DropdownSection,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import NotificationsCard from "@/components/notifications/notifications";
import { siteConfig } from "@/config/site";
import { Logout } from "@/lib/logout";

import { ThemeSwitch } from "../theme-switch";

import { sectionAdminItems, sectionItems } from "./sidebar-items";
import SidebarDrawer from "./sidebar-drawer";
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
  session,
  settings,
  notifications,
}: {
  children: React.ReactNode;
  user: any;
  session: any;
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

  async function LogoutHandler() {
    await Logout();
  }

  const content = (
    <div className="relative flex h-full w-72 flex-1 flex-col p-6">
      <div className="flex items-center gap-2 px-2">
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
        <span className="text-small font-bold text-foreground">AlertFlow</span>
        <div className="flex ml-auto gap-2 items-center justify-center">
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
          <ThemeSwitch />
        </div>
      </div>
      <Spacer y={8} />
      <Dropdown>
        <DropdownTrigger>
          <div className="flex items-center gap-3 px-3">
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
              size="sm"
            />
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
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="profile"
            showDivider
            startContent={<Icon icon="solar:smile-square-broken" width={18} />}
            onPress={() => router.push(`/user/${user?.id}`)}
          >
            View Profile
          </DropdownItem>
          <DropdownSection title="Copy">
            <DropdownItem
              key="userid"
              startContent={<Icon icon="solar:user-id-line-duotone" width={18} />}
              onPress={() => {
                // eslint-disable-next-line no-undef
                navigator.clipboard.writeText(user.id);
                toast.success("Copied to clipboard!");
              }}
            >
              UserID
            </DropdownItem>
            <DropdownItem
              key="api_key"
              startContent={<Icon icon="solar:key-square-2-broken" width={18} />}
              onPress={() => {
                // eslint-disable-next-line no-undef
                navigator.clipboard.writeText(session);
                toast.success("Copied to clipboard!");
              }}
            >
              Token
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <Spacer y={8} />

      <Sidebar
        defaultSelectedKey="home"
        items={user.role === "Admin" ? sectionAdminItems : sectionItems}
        selectedKeys={[currentPath]}
      />

      <Spacer y={8} />

      {user.role === "Admin" && settings.maintenance && (
        <Card className="mx-2 overflow-visible bg-danger-300" shadow="sm">
          <CardBody className="items-center py-5 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Icon icon="solar:danger-triangle-broken" width={20} />
              <h3 className="text-medium font-medium">Maintenance</h3>
            </div>
            <p className="p-4 text-small">
              Maintenance mode is currently active.
            </p>
          </CardBody>
        </Card>
      )}

      <Spacer y={8} />
      <div className="mt-auto flex flex-col">
        <Popover placement="top">
          <PopoverTrigger>
            <Button
              fullWidth
              className="justify-start text-default-500 data-[hover=true]:text-foreground"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:info-circle-line-duotone"
                  width={24}
                />
              }
              variant="light"
            >
              Help & Information
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-wrap items-center gap-1 px-1 py-2">
              <p className="text-small font-bold">Version:</p>
              <p className="text-small">v{siteConfig.version}</p>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          className="justify-start text-default-500 data-[hover=true]:text-danger"
          startContent={<Icon icon="solar:logout-3-broken" width={24} />}
          variant="light"
          onPress={LogoutHandler}
        >
          Log Out
        </Button>
        <div className="flex items-center justify-center gap-1 pt-4">
          <span className="text-xs text-default-600">Powered by</span>
          <p className="text-sm text-primary font-bold">JustLab</p>
          <p className="text-sm text-default-600">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh w-full">
      <SidebarDrawer
        className="overflow-y-hidden !border-r-small border-divider"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        {content}
      </SidebarDrawer>
      <div className="w-full flex-1 flex-col p-4">
        <header className="flex sm:hidden items-center gap-2">
          <Button
            isIconOnly
            className="flex sm:hidden"
            size="sm"
            variant="light"
            onPress={onOpen}
          >
            <Icon
              className="text-default-500"
              height={24}
              icon="solar:hamburger-menu-outline"
              width={24}
            />
          </Button>
          <Image
            alt="Logo"
            height={32}
            radius="none"
            shadow="none"
            src={`/images/af_logo_${theme === "light" || isSSR ? "black" : "white"}.png`}
            width={32}
            onClick={onOpen}
          />
          <h2 className="text-medium font-bold text-default-700">AlertFlow</h2>
        </header>
        <main className="mt-4 h-full w-full overflow-visible">{children}</main>
      </div>
    </div>
  );
}
