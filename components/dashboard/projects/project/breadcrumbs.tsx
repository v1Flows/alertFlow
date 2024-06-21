"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { HomeIcon, LayoutIcon } from "@/components/icons";

export default function ProjectBreadcrumbs({ id }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard" startContent={<HomeIcon />}>
        Dashboard
      </BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/projects" startContent={<LayoutIcon />}>
        Projects
      </BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/projects/${id}`}>{id}</BreadcrumbItem>
    </Breadcrumbs>
  );
}
