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
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
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
import { PlayCircleIcon, TagIcon } from "@/components/icons";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "@/components/icons";
import NotificationsCard from "@/components/notifications/notifications";

export default function Nabar({ user, notifications, session, settings }: any) {
  const router = useRouter();
  const { theme } = useTheme();
  const isSSR = useIsSSR();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

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
          <Link aria-current="page" onPress={() => goTo("/")}>
            Home
          </Link>
        </NavbarItem>
        <NavbarMenuItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                isDisabled={!user?.email}
                radius="sm"
                variant="light"
              >
                Dashboard
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="home"
                description="See your dashboard home page."
                startContent={icons.activity}
                onPress={() => goTo("/dashboard")}
              >
                Home
              </DropdownItem>
              <DropdownItem
                key="projects"
                description="Get a list of your projects and their status."
                startContent={icons.server}
                onPress={() => goTo("/dashboard/projects")}
              >
                Projects
              </DropdownItem>
              <DropdownItem
                key="flows"
                description="See all your flows and their details."
                startContent={icons.flash}
                onPress={() => goTo("/dashboard/flows")}
              >
                Flows
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarMenuItem>
        {user.role === "Admin" && (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent font-bold"
                  color="danger"
                  endContent={icons.chevron}
                  isDisabled={!user?.email || user?.role !== "Admin"}
                  radius="sm"
                  variant="flat"
                >
                  Admin
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="users"
                  description="Manage users"
                  startContent={icons.user}
                  onPress={() => goTo("/admin/users")}
                >
                  Users
                </DropdownItem>
                <DropdownItem
                  key="projects"
                  description="Get a list of all projects and their status."
                  startContent={icons.server}
                  onPress={() => goTo("/admin/projects")}
                >
                  Projects
                </DropdownItem>
                <DropdownItem
                  key="flows"
                  description="See all flows and their details."
                  startContent={icons.flash}
                  onPress={() => goTo("/admin/flows")}
                >
                  Flows
                </DropdownItem>
                <DropdownItem
                  key="runners"
                  description="Check all runners, their status and more."
                  startContent={
                    <PlayCircleIcon className="h-8 w-8 text-warning" />
                  }
                  onPress={() => goTo("/admin/runners")}
                >
                  Runners
                </DropdownItem>
                <DropdownItem
                  key="apikeys"
                  description="See all api keys and disable them."
                  startContent={
                    <TagIcon className="h-8 w-8 text-default-500" />
                  }
                  onPress={() => goTo("/admin/apikeys")}
                >
                  API Keys
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  description="Maintenance, signup and more."
                  startContent={icons.scale}
                  onPress={() => goTo("/admin/settings")}
                >
                  Page Settings
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
        <NavbarItem className="flex">
          <Popover offset={12} placement="bottom-end">
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className="overflow-visible"
                radius="full"
                variant="light"
              >
                <Badge
                  color="danger"
                  content={notifications.filter((n: any) => !n.is_read).length}
                  showOutline={false}
                  size="md"
                >
                  <Icon
                    className="text-default-500"
                    icon="solar:bell-linear"
                    width={22}
                  />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
              <NotificationsCard
                className="w-full shadow-none"
                incNotifications={notifications}
              />
            </PopoverContent>
          </Popover>
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
        <Popover offset={12} placement="bottom-end">
          <PopoverTrigger>
            <Button
              disableRipple
              isIconOnly
              className="overflow-visible"
              radius="full"
              variant="light"
            >
              <Badge
                color="danger"
                content={notifications.filter((n: any) => !n.is_read).length}
                showOutline={false}
                size="md"
              >
                <Icon
                  className="text-default-500"
                  icon="solar:bell-linear"
                  width={22}
                />
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
            <NotificationsCard
              className="w-full shadow-none"
              incNotifications={notifications}
            />
          </PopoverContent>
        </Popover>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link color="foreground" onPress={() => goTo("/")}>
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                isDisabled={!user?.email}
                radius="sm"
                variant="light"
              >
                Dashboard
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="home"
                description="See your dashboard home page."
                startContent={icons.activity}
                onPress={() => goTo("/dashboard")}
              >
                Home
              </DropdownItem>
              <DropdownItem
                key="projects"
                description="Get a list of your projects and their status."
                startContent={icons.server}
                onPress={() => goTo("/dashboard/projects")}
              >
                Projects
              </DropdownItem>
              <DropdownItem
                key="flows"
                description="See all your flows and their details."
                startContent={icons.flash}
                onPress={() => goTo("/dashboard/flows")}
              >
                Flows
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarMenuItem>
        {user.role === "Admin" && (
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent font-bold"
                  color="danger"
                  endContent={icons.chevron}
                  isDisabled={!user?.email || user?.role !== "Admin"}
                  radius="sm"
                  variant="flat"
                >
                  Admin
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="users"
                  description="Manage users"
                  startContent={icons.user}
                  onPress={() => goTo("/admin/users")}
                >
                  Users
                </DropdownItem>
                <DropdownItem
                  key="projects"
                  description="Get a list of all projects and their status."
                  startContent={icons.server}
                  onPress={() => goTo("/admin/projects")}
                >
                  Projects
                </DropdownItem>
                <DropdownItem
                  key="flows"
                  description="See all flows and their details."
                  startContent={icons.flash}
                  onPress={() => goTo("/admin/flows")}
                >
                  Flows
                </DropdownItem>
                <DropdownItem
                  key="runners"
                  description="Check all runners, their status and more."
                  startContent={
                    <PlayCircleIcon className="h-8 w-8 text-warning" />
                  }
                  onPress={() => goTo("/admin/runners")}
                >
                  Runners
                </DropdownItem>
                <DropdownItem
                  key="apikeys"
                  description="See all api keys and disable them."
                  startContent={
                    <TagIcon className="h-8 w-8 text-default-500" />
                  }
                  onPress={() => goTo("/admin/apikeys")}
                >
                  API Keys
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  description="Maintenance, signup and more."
                  startContent={icons.scale}
                  onPress={() => goTo("/admin/settings")}
                >
                  Page Settings
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
