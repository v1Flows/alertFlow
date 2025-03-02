"use client";

import { Icon } from "@iconify/react";
import { BreadcrumbItem, Breadcrumbs, Snippet } from "@heroui/react";
import React from "react";

export default function ProjectBreadcrumbs({ id }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/projects">
        <Icon icon="hugeicons:ai-folder-01" width={20} /> Projects
      </BreadcrumbItem>
      <BreadcrumbItem href={`/projects/${id}`}>
        <Snippet hideSymbol className="bg-transparent" size="sm" variant="flat">
          {id}
        </Snippet>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
