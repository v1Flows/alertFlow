"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { PlusIcon, TagIcon } from "@/components/icons";
import CreateRunnerToken from "@/lib/fetch/project/POST/CreateRunnerToken";

export default function CreateTokenModal({
  disclosure,
  projectID,
}: {
  disclosure: UseDisclosureReturn;
  projectID: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleCreateToken() {
    setIsLoading(true);

    const response = await CreateRunnerToken({
      projectId: projectID,
      description,
    });

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setDescription("");
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
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold">
                <TagIcon />
                Create Token
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Description"
                  placeholder="Enter the project description"
                  value={description}
                  variant="bordered"
                  onValueChange={setDescription}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Discard
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  startContent={<PlusIcon />}
                  onPress={handleCreateToken}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
