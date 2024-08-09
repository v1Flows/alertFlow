"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Chip,
  Image,
} from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";

import Login from "@/components/auth/login";
import { ThemeSwitch } from "@/components/theme-switch";

export default function Navbar({ user, session, settings }: any) {
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

      <NavbarContent className="sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="sm:flex">
          <Login
            session={session}
            settings={settings}
            showSignUp={true}
            user={user}
          />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}
