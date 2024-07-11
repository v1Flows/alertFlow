"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Card,
  CardHeader,
  cn,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { LibraryIcon } from "lucide-react";

import CreateProject from "@/lib/fetch/project/POST/CreateProject";
import { CheckIcon, InfoIcon, PlusIcon, TagIcon } from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import CreateRunnerApiKey from "@/lib/fetch/project/POST/CreateRunnerAPIKey";

export default function CreateApiKeyModal({
  disclosure,
  projectID,
}: {
  disclosure: UseDisclosureReturn;
  projectID: any;
}) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = disclosure;

  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleCreateAPIKey() {
    setIsLoading(true);

    const response = await CreateRunnerApiKey({
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
                  isLoading={isLoading}
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
