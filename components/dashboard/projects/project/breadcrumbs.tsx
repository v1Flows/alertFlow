"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import { HomeIcon, Server } from "@/components/icons";

export default function ProjectBreadcrumbs({ id }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard" startContent={<HomeIcon />}>
        Dashboard
      </BreadcrumbItem>
      <BreadcrumbItem
        href="/dashboard/projects"
        startContent={
          <Server className="text-success" fill="currentColor" size={15} />
        }
      >
        Projects
      </BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/projects/${id}`}>{id}</BreadcrumbItem>
    </Breadcrumbs>
  );
}
