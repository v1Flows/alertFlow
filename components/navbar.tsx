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
} from "@nextui-org/react";
import { cookies } from "next/headers";

import Login from "@/components/auth/login";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

import DashboardMenu from "./navbar/dashboard";

export const Navbar = () => {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarBrand as="li" className="gap-1 max-w-fit">
        <Logo />
        <p className="font-bold text-inherit">AlertFlow</p>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="start"
      >
        <NavbarItem isActive>
          <Link aria-current="page" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <DashboardMenu user={user} />
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/faq">
            FAQ
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/support">
            Support
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <Login user={user} />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <DashboardMenu user={user} />
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="/faq">
            FAQ
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="/support">
            Support
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Divider className="my-4" />
          <Login user={user} />
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};
