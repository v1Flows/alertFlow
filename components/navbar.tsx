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
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { cookies } from "next/headers";

import DashboardMenu from "./navbar/dashboard";

import Login from "@/components/auth/login";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";

export const Navbar = () => {
  const user = JSON.parse(cookies().get("user")?.value || "{}");

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

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
          <DashboardMenu />
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
          <Login />
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};
