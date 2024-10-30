"use client";

import { Icon } from "@iconify/react";
import { Button, useDisclosure } from "@nextui-org/react";

import CreateDocumentModal from "@/components/functions/docs/create";

export default function DashboardDocsHeader({ userDetails }: any) {
  const addDocumentModal = useDisclosure();

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 items-center justify-between">
        <p className="text-2xl font-bold">Documentation</p>
        {userDetails && userDetails.role === "admin" && (
          <div className="flex flex-cols justify-end items-center gap-4">
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
