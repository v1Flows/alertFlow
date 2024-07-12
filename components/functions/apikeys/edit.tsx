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

import { TagIcon } from "@/components/icons";
import UpdateToken from "@/lib/fetch/apikeys/update";

export default function EditTokenModal({
  token,
  disclosure,
}: {
  token: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  // create modal
  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;

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
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-warning">
                <TagIcon size={20} /> Edit Token
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Description"
                  placeholder="Enter the flow description"
                  type="description"
                  value={description}
                  variant="bordered"
                  onValueChange={setDescription}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={updateToken}
                >
                  Apply Change
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
