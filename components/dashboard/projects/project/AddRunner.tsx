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
import AddProjectRunner from "@/lib/fetch/project/POST/AddRunner";

export default function AddRunnerModal({ projectID }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [name, setName] = React.useState("");

  async function handleCreateAPIKey() {
    setIsCreateLoading(true);

    const response = await AddProjectRunner({
      projectId: projectID,
      name,
    });

    if (response.result === "success") {
      setName("");
      onOpenChange();
      // eslint-disable-next-line no-undef
      window.location.reload();
    } else {
      console.log(response);
    }

    setIsCreateLoading(false);
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
    </>
  );
}
