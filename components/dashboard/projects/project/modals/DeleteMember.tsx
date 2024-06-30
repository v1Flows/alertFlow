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
  Code,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

import { DeleteDocumentIcon, DeleteIcon } from "@/components/icons";

export default function DeleteMemberModal({
  projectID,
  mailInc,
  roleInc,
}: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  async function handleDeleteMember() {
    setIsDeleteLoading(true);

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
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 text-danger">
                <DeleteDocumentIcon />
                Remove Member from Project
              </ModalHeader>
              <ModalBody>
                <Code>
                  Email: {mailInc}
                  <br />
                  Role: {roleInc}
                </Code>
                <p>
                  Are you sure you want to remove this User from the Project?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleteLoading}
                  onPress={handleDeleteMember}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
