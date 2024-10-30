"use client";

import { Icon } from "@iconify/react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";

import { subtitle } from "@/components/primitives";
import DeleteDocModal from "@/components/functions/docs/delete";
import EditDocumentModal from "@/components/functions/docs/edit";

export default function DocHeader({ doc, user }: any) {
  const deleteDocumentModal = useDisclosure();
  const editDocumentModal = useDisclosure();

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/dashboard/docs">
          <Icon icon="solar:notes-outline" width={20} /> Documentation
        </BreadcrumbItem>
        <BreadcrumbItem href={`/dashboard/docs/${doc.id}`}>
          {doc.title}
        </BreadcrumbItem>
      </Breadcrumbs>
      <Spacer y={2} />
      <div className="flex flex-cols items-center justify-between">
        <div>
          <h1 className={subtitle({ className: "mb-0 font-bold" })}>
            {doc.title}
          </h1>
          <Spacer y={1} />
          <div className="flex flex-wrap gap-2 items-center">
            <Chip color="primary" radius="sm" variant="flat">
              Category: {doc.category}
            </Chip>
            {doc.hidden ? (
              <Chip color="danger" radius="sm" variant="flat">
                Hidden
              </Chip>
            ) : (
              <Chip color="success" radius="sm" variant="flat">
                Published
              </Chip>
            )}
          </div>
        </div>
        {user.role === "admin" && (
          <div className="flex flex-cols gap-2">
            <Button
              color="warning"
              isDisabled={user.role !== "admin"}
              startContent={
                <Icon icon="solar:pen-new-square-outline" width={20} />
              }
              variant="flat"
              onPress={editDocumentModal.onOpenChange}
            >
              Edit
            </Button>
            <Button
              color="danger"
              isDisabled={user.role !== "admin"}
              startContent={
                <Icon icon="solar:trash-bin-trash-outline" width={20} />
              }
              variant="flat"
              onPress={deleteDocumentModal.onOpenChange}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      <EditDocumentModal disclosure={editDocumentModal} doc={doc} />
      <DeleteDocModal disclosure={deleteDocumentModal} doc={doc} />
    </>
  );
}
