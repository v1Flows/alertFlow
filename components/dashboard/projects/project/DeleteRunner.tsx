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

import { DeleteIcon } from "@/components/icons";
import DeleteProjectApiKey from "@/lib/fetch/project/DELETE/DeleteAPIKey";

export default function DeleteRunnerModal(runnerID: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  async function handleDeleteAPIKey() {
    setIsDeleteLoading(true);

    const response = await DeleteProjectApiKey(runnerID.runnerID);

    if (response.result === "success") {
      onOpenChange();
      router.refresh();
    } else {
      console.log(response);
    }

    setIsDeleteLoading(false);
  }

  return (
    <>
      <DeleteIcon onClick={onOpen} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Delete Runner</p>
                <p className="text-sm text-default-500">{runnerID.runnerID}</p>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this Runner? This action
                  cannot be undone.
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
