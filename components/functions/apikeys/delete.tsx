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

import DeleteRunnerApiKey from "@/lib/fetch/project/DELETE/DeleteRunnerAPIKey";

export default function DeleteApiKeyModal({
  disclosure,
  apikey,
}: {
  disclosure: UseDisclosureReturn;
  apikey: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);

  async function handleDeleteAPIKey() {
    setIsLoading(true);

    const response = await DeleteRunnerApiKey(apikey.id);

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      toast.success("API key deleted successfully");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Failed to create project");
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>Delete API Key</p>
                <p className="text-sm text-default-500">{apikey.id}</p>
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
                  isLoading={isLoading}
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
