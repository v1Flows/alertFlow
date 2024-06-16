'use client'
import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Link } from "@nextui-org/react";
import { ChevronDown, Lock, Activity, Flash, Server, TagUser, Scale } from "@/components/icons";

export default function DashboardMenu() {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: <Activity className="text-secondary" fill="currentColor" size={30} />,
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          disableRipple
          className="p-0 bg-transparent data-[hover=true]:bg-transparent"
          radius="sm"
          variant="light"
          endContent={icons.chevron}
          isDisabled={!user.email}
        >
          Dashboard
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="home"
          description="See your dashboard home page."
          startContent={icons.activity}
          href="/dashboard"
        >
          Home
        </DropdownItem>
        <DropdownItem
          key="projects"
          description="Get a list of your projects and their status."
          startContent={icons.server}
          href="/dashboard/projects"
        >
          Projects
        </DropdownItem>
        <DropdownItem
          key="flows"
          description="See all your flows and their details."
          startContent={icons.flash}
          href="/dashboard/flows"
        >
          Flows
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
