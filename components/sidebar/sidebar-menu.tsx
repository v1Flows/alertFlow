"use client";

import React from "react";
import {
  Avatar,
  Button,
  Spacer,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { usePathname } from "next/navigation";

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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme } = useTheme();
  const isSSR = useIsSSR();
  const pathname = usePathname();
  const currentPath1 = pathname.split("/")?.[1];
  const currentPath2 = pathname.split("/")?.[2];
  const currentPath = currentPath2
    ? `${currentPath1}_${currentPath2}`
    : currentPath1;

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
      </div>
      <Spacer y={8} />
      <div className="flex items-center gap-3 px-3">
        <Avatar isBordered name={user.username} size="sm" />
        <div className="flex flex-col">
          <p className="text-small font-medium text-default-600">
            {user.username}
          </p>
          <p className="text-tiny text-default-400">{user.email}</p>
        </div>
      </div>

      <Spacer y={8} />

      <Sidebar
        defaultSelectedKey="home"
        items={user.role === "Admin" ? sectionAdminItems : sectionItems}
        selectedKeys={[currentPath]}
      />

      <Spacer y={8} />
      <div className="mt-auto flex flex-col">
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
        <Button
          className="justify-start text-default-500 data-[hover=true]:text-foreground"
          startContent={
            <Icon
              className="rotate-180 text-default-500"
              icon="solar:minus-circle-line-duotone"
              width={24}
            />
          }
          variant="light"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh w-full">
      <SidebarDrawer
        className=" !border-r-small border-divider"
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
