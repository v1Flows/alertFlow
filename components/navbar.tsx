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
} from "@nextui-org/react";
import { cookies } from "next/headers";

import Login from "@/components/auth/login";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import AdminGetSettings from "@/lib/fetch/page/settings";

import DashboardMenu from "./navbar/dashboard";
import AdminMenu from "./navbar/admin";

export const Navbar = async () => {
  const user = JSON.parse(cookies().get("user")?.value || "{}");
  const session = cookies().get("session")?.value;

  const settings = await AdminGetSettings();

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
        {user.role === "Admin" && (
          <NavbarItem>
            <AdminMenu user={user} />
          </NavbarItem>
        )}
        {/* <NavbarItem>
          <Link color="foreground" href="/faq">
            FAQ
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/support">
            Support
          </Link>
        </NavbarItem> */}
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
        {user.role === "Admin" && (
          <NavbarItem>
            <AdminMenu user={user} />
          </NavbarItem>
        )}
        {/* <NavbarMenuItem>
          <Link color="foreground" href="/faq">
            FAQ
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link color="foreground" href="/support">
            Support
          </Link>
        </NavbarMenuItem> */}
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
};
