"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
  Link,
  Divider,
  Chip,
  Button,
  Image,
  Popover,
  PopoverTrigger,
  Badge,
  PopoverContent,
} from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { Icon } from "@iconify/react";

import Login from "@/components/auth/login";
import { ThemeSwitch } from "@/components/theme-switch";
import NotificationsCard from "@/components/notifications/notifications";

export default function Nabar({ user, notifications, session, settings }: any) {
  const router = useRouter();
  const { theme } = useTheme();
  const isSSR = useIsSSR();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function goTo(url: string) {
    // TDOD: fix redirect not working
    setIsMenuOpen(false);
    router.push(url);
  }

  return (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand as="li" className="gap-1 max-w-fit">
        <Image
          alt="Logo"
          height={32}
          radius="none"
          shadow="none"
          src={`/images/af_logo_${theme === "light" || isSSR ? "black" : "white"}.png`}
          width={32}
        />
        <p className="font-bold text-inherit">AlertFlow</p>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="start"
      >
        <NavbarItem isActive>
          <Link aria-current="page" color="primary" onPress={() => goTo("/")}>
            Home
          </Link>
        </NavbarItem>
        {user?.email && (
          <NavbarItem>
            <Link
              aria-current="page"
              color="foreground"
              isDisabled={!user?.email}
              onPress={() => goTo("/dashboard")}
            >
              Dashboard
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      {user.role === "Admin" && settings.maintenance && (
        <NavbarContent justify="center">
          <NavbarItem>
            <Chip color="danger" radius="sm" variant="flat">
              Maintenance is Active!
            </Chip>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Login
            session={session}
            settings={settings}
            showSignUp={true}
            user={user}
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarMenu>
        <NavbarItem isActive>
          <Link color="primary" onPress={() => goTo("/")}>
            Home
          </Link>
        </NavbarItem>
        {user?.email && (
          <NavbarItem>
            <Link
              aria-current="page"
              color="foreground"
              isDisabled={!user?.email}
              onPress={() => goTo("/dashboard")}
            >
              Dashboard
            </Link>
          </NavbarItem>
        )}
        <NavbarMenuItem>
          <Divider className="my-4" />
          <Login
            session={session}
            settings={settings}
            showSignUp={true}
            user={user}
          />
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
}
