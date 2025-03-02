"use client";

import { Icon } from "@iconify/react";
import { BreadcrumbItem, Breadcrumbs, Snippet } from "@heroui/react";
import React from "react";

export default function FlowBreadcrumbs({ id }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/flows">
        <Icon icon="hugeicons:workflow-square-10" width={20} /> Flows
      </BreadcrumbItem>
      <BreadcrumbItem href={`/flows/${id}`}>
        <Snippet hideSymbol className="bg-transparent" size="sm" variant="flat">
          {id}
        </Snippet>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
