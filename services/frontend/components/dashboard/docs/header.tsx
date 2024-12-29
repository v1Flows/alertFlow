"use client";

import { Icon } from "@iconify/react";
import { Button, useDisclosure } from "@nextui-org/react";

import CreateDocumentModal from "@/components/functions/docs/create";

export default function DashboardDocsHeader({ userDetails }: any) {
  const addDocumentModal = useDisclosure();

  return (
    <>
      <div className="grid grid-cols-1 items-center justify-between gap-2 lg:grid-cols-2">
        <p className="text-2xl font-bold">Documentation</p>
        {userDetails && userDetails.role === "admin" && (
          <div className="flex-cols flex items-center justify-end gap-4">
            <Button
              color="danger"
              isDisabled={userDetails.role !== "admin"}
              startContent={
                <Icon icon="solar:crown-line-line-duotone" width={20} />
              }
              variant="flat"
              onPress={addDocumentModal.onOpen}
            >
              Add Documentation
            </Button>
          </div>
        )}
      </div>
      <CreateDocumentModal disclosure={addDocumentModal} />
    </>
  );
}
