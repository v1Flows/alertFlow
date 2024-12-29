"use client";

import {
  Chip,
  Divider,
  Image,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/react";
import { useIsSSR } from "@react-aria/ssr";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import Login from "@/components/auth/login";

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
      <NavbarBrand as="li" className="max-w-fit gap-1">
        <Image
          alt="Logo"
          height={32}
          radius="none"
          shadow="none"
          src={`https://s3-console.justlab.xyz/api/v1/buckets/alertflow/objects/download?preview=true&prefix=af_logo_${theme === "light" || isSSR ? "black" : "white"}.png`}
          width={32}
        />
        <p className="font-bold text-inherit">AlertFlow</p>
      </NavbarBrand>
      <NavbarContent
        className="hidden basis-1/5 sm:flex sm:basis-full"
        justify="start"
      >
        {user?.email && (
          <NavbarItem isActive>
            <Link
              aria-current="page"
              color="primary"
              isDisabled={!user?.email}
              onPress={() => goTo("/")}
            >
              Dashboard
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      {user.role === "admin" && settings.maintenance && (
        <NavbarContent justify="center">
          <NavbarItem>
            <Chip color="danger" radius="sm" variant="flat">
              Maintenance is Active!
            </Chip>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarContent
        className="hidden basis-1/5 sm:flex sm:basis-full"
        justify="end"
      >
        <NavbarItem className="gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="sm:flex">
          <Login showSignUp session={session} settings={settings} user={user} />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
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
              onPress={() => goTo("/")}
            >
              Dashboard
            </Link>
          </NavbarItem>
        )}
        <NavbarMenuItem>
          <Divider className="my-4" />
          <Login showSignUp session={session} settings={settings} user={user} />
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
}
