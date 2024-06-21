"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import { DeleteIcon } from "@/components/icons";
import DeleteProjectApiKey from "@/lib/fetch/project/DELETE/DeleteAPIKey";

export default function DeleteAPIKeyModal(keyID: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  async function handleDeleteAPIKey() {
    setIsDeleteLoading(true);

    const response = await DeleteProjectApiKey(keyID.keyID);

    if (response.result === "success") {
      onOpenChange();
      toast.success("API key deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete API key");
    }

    setIsDeleteLoading(false);
  }

  return (
    <>
      <Toaster richColors position="bottom-center" />
      <DeleteIcon onClick={onOpen} />
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Delete API Key</p>
                <p className="text-sm text-default-500">{keyID.keyID}</p>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this API key? This action
                  cannot be undone and will cause any active runner which is
                  using this key to not work anylonger.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleteLoading}
                  onPress={handleDeleteAPIKey}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
