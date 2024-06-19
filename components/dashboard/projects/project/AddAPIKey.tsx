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

import { PlusIcon } from "@/components/icons";
import CreateProjectApiKey from "@/lib/fetch/project/POST/CreateAPIKey";

export default function AddAPIKeyModal({ projectID }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [description, setDescription] = React.useState("");

  async function handleCreateAPIKey() {
    setIsLoginLoading(true);

    const response = await CreateProjectApiKey({
      projectId: projectID,
      description,
    });

    if (response.result === "success") {
      setDescription("");
      onOpenChange();
      window.location.reload();
    } else {
      console.log(response);
      alert("Something went wrong");
    }

    setIsLoginLoading(false);
  }

  return (
    <>
      <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
        Add New
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
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
                  isLoading={isLoginLoading}
                  onPress={handleCreateAPIKey}
                >
                  Create API Key
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
