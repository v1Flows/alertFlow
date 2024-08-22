"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import UpdateToken from "@/lib/fetch/tokens/update";

export default function EditTokenModal({
  token,
  disclosure,
}: {
  token: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  // create modal
  const { isOpen, onOpenChange, onClose } = disclosure;

  const [description, setDescription] = React.useState(token.description);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setDescription(token.description);
  }, [token]);

  async function updateToken() {
    setIsLoading(true);

    const response = await UpdateToken(token.id, description);

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Failed to update token");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Edit Token</p>
                  <p className="text-sm text-default-500">
                    Edit the token details below and click apply changes to
                    save.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter the flow description"
                  type="description"
                  value={description}
                  variant="flat"
                  onValueChange={setDescription}
                />
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={updateToken}
                >
                  Apply Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
