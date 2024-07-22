"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem, Snippet } from "@nextui-org/react";

import { Flash, HomeIcon } from "@/components/icons";

export default function FlowBreadcrumbs({ id }: any) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/dashboard" startContent={<HomeIcon />}>
        Dashboard
      </BreadcrumbItem>
      <BreadcrumbItem
        href="/dashboard/flows"
        startContent={
          <Flash className="text-primary" fill="currentColor" size={15} />
        }
      >
        Flows
      </BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/flows/${id}`}>
        <Snippet hideSymbol className="bg-transparent" size="sm" variant="flat">
          {id}
        </Snippet>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
