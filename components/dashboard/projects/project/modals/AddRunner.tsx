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
  Divider,
  Snippet,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { LibraryIcon } from "lucide-react";

import { CheckIcon, InfoIcon, PlusIcon } from "@/components/icons";
import AddProjectRunner from "@/lib/fetch/project/POST/AddRunner";

export default function AddRunnerModal({ projectID }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [name, setName] = React.useState("");

  // instructions modal
  const {
    isOpen: isOpenInstructions,
    onOpen: onOpenInstructions,
    onOpenChange: onOpenChangeInstructions,
  } = useDisclosure();

  async function handleCreateAPIKey() {
    setIsCreateLoading(true);

    const response = await AddProjectRunner({
      projectId: projectID,
      name,
    });

    if (response.result === "success") {
      setName("");
      onOpenChange();
      onOpenChangeInstructions();
      router.refresh();
    } else {
      toast.error("Failed to create runner");
    }

    setIsCreateLoading(false);
  }

  return (
    <>
      <Toaster richColors position="bottom-center" />
      <Button
        color="primary"
        endContent={<PlusIcon height={undefined} width={undefined} />}
        onPress={onOpen}
      >
        Add New
      </Button>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Runner
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  placeholder="Enter the runner name"
                  value={name}
                  variant="bordered"
                  onValueChange={setName}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isCreateLoading}
                  onPress={handleCreateAPIKey}
                >
                  Add Runner
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenInstructions}
        placement="center"
        onOpenChange={onOpenChangeInstructions}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-success">
                Your new Runner can now be configured
              </ModalHeader>
              <ModalBody>
                <p>
                  You can now use the below API URL to configure your Runner.
                </p>
                <Divider />
                <div>
                  <p className="text-sm font-bold text-default-400">API URL</p>
                  <Snippet hideSymbol className="w-full">
                    {`${process.env.API_ENDPOINT}/runners`}
                  </Snippet>
                </div>
                <div>
                  <p className="text-sm font-bold text-default-400">
                    Runner ID
                  </p>
                  <Chip
                    color="primary"
                    radius="sm"
                    startContent={<InfoIcon />}
                    variant="flat"
                  >
                    The Runner-ID can be found on the Runners-Tab
                  </Chip>
                </div>
                <p className="text-sm text-default-500 mt-2">
                  If you need help with the configuration, please click the
                  documentation button below.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  startContent={<LibraryIcon />}
                  variant="bordered"
                  onPress={onClose}
                >
                  Show Documentation
                </Button>
                <Button
                  color="success"
                  startContent={<CheckIcon />}
                  onPress={onClose}
                >
                  Understood
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
