"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem, Snippet } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function ProjectBreadcrumbs({ id }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard">
        <Icon icon="solar:clipboard-text-broken" width={20} />
      </BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/projects">
        <Icon icon="solar:box-broken" width={20} />
      </BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/projects/${id}`}>
        <Snippet hideSymbol className="bg-transparent" size="sm" variant="flat">
          {id}
        </Snippet>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
