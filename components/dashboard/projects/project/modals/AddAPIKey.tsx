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
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import { PlusIcon, TagIcon } from "@/components/icons";
import CreateRunnerApiKey from "@/lib/fetch/project/POST/CreateRunnerAPIKey";

export default function AddAPIKeyModal({ project, settings }: any) {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [description, setDescription] = React.useState("");

  async function handleCreateAPIKey() {
    setIsCreateLoading(true);

    const response = await CreateRunnerApiKey({
      projectId: project.id,
      description,
    });

    if (response.result === "success") {
      setDescription("");
      onOpenChange();
      toast.success("API key created successfully");
      router.refresh();
    } else {
      toast.error(response.message);
    }

    setIsCreateLoading(false);
  }

  return (
    <>
      <Toaster richColors position="bottom-center" />
      <Button
        color="primary"
        endContent={<PlusIcon height={undefined} width={undefined} />}
        isDisabled={!settings.create_api_keys || project.disabled}
        onPress={onOpen}
      >
        Add New
      </Button>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold">
                <TagIcon />
                Create API Key
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
                  isLoading={isCreateLoading}
                  startContent={<PlusIcon />}
                  onPress={handleCreateAPIKey}
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
