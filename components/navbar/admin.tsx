"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
  PlayCircleIcon,
} from "@/components/icons";

export default function AdminMenu(user: any) {
  const userData = user.user;

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-secondary" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          disableRipple
          className="p-0 bg-transparent data-[hover=true]:bg-transparent font-bold"
          color="danger"
          endContent={icons.chevron}
          isDisabled={!userData?.email || userData?.role !== "Admin"}
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
          href="/admin/users"
          startContent={icons.user}
        >
          Users
        </DropdownItem>
        <DropdownItem
          key="projects"
          description="Get a list of your projects and their status."
          href="/admin/projects"
          startContent={icons.server}
        >
          Projects
        </DropdownItem>
        <DropdownItem
          key="flows"
          description="See all your flows and their details."
          href="/admin/flows"
          startContent={icons.flash}
        >
          Flows
        </DropdownItem>
        <DropdownItem
          key="runners"
          description="See all your flows and their details."
          href="/admin/runners"
          startContent={<PlayCircleIcon className="h-8 w-8 text-warning" />}
        >
          Runners
        </DropdownItem>
        <DropdownItem
          key="settings"
          description="See all your flows and their details."
          href="/admin/settings"
          startContent={icons.scale}
        >
          Page Settings
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
