"use client";

import { Icon } from "@iconify/react";
import { BreadcrumbItem, Breadcrumbs, Spacer } from "@nextui-org/react";

import { subtitle } from "@/components/primitives";

export default function DocHeader({ doc }: any) {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard/docs">
          <Icon icon="solar:notes-broken" width={20} /> Documentation
        </BreadcrumbItem>
        <BreadcrumbItem href={`/dashboard/docs/${doc.id}`}>
          {doc.title}
        </BreadcrumbItem>
      </Breadcrumbs>
      <Spacer y={2} />
      <h1 className={subtitle({ className: "mb-0 font-bold" })}>{doc.title}</h1>
    </>
  );
}
