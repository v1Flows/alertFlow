"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import DeleteRunnerToken from "@/lib/fetch/project/DELETE/DeleteRunnerToken";

export default function DeleteTokenModal({
  disclosure,
  token,
}: {
  disclosure: UseDisclosureReturn;
  token: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDeleteToken() {
    setIsLoading(true);

    const response = await DeleteRunnerToken(token.id);

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      toast.success("Token deleted successfully");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Failed to delete token");
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Delete Token</p>
                <p className="text-sm text-default-500">{token.id}</p>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this token? This action cannot
                  be undone and will cause any active runner which is using this
                  key to not work anylonger.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  onPress={handleDeleteToken}
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
