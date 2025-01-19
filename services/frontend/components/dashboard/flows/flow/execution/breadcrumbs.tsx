"use client";

import { Icon } from "@iconify/react";
import { BreadcrumbItem, Breadcrumbs, Snippet } from "@heroui/react";
import React from "react";

export default function ExecutionBreadcrumbs({ flowID, executionID }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/flows">
        <Icon icon="solar:book-2-outline" width={20} />
      </BreadcrumbItem>
      <BreadcrumbItem href={`/flows/${flowID}`}>Flow</BreadcrumbItem>
      <BreadcrumbItem
        isCurrent
        href={`/flows/${flowID}/execution/${executionID}`}
      >
        <Snippet hideSymbol className="bg-transparent" size="sm" variant="flat">
          {executionID}
        </Snippet>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
