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
  Select,
  SelectItem,
} from "@nextui-org/react";

import { PlusIcon } from "@/components/icons";
import CreateProjectApiKey from "@/lib/fetch/project/POST/CreateAPIKey";

export default function AddMemberModal({ projectID }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [mail, setMail] = React.useState("");
  const [role, setRole] = React.useState(new Set([]));

  async function handleCreateAPIKey() {
    setIsLoginLoading(true);

    const response = await CreateProjectApiKey({
      projectId: projectID,
      description,
    });

    if (response.result === "success") {
      setDescription("");
      onOpenChange();
      // eslint-disable-next-line no-undef
      window.location.reload();
    } else {
      console.log(response);
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
                Add Member to Project
              </ModalHeader>
              <ModalBody>
                <Input
                  label="User Email"
                  placeholder="Enter the email of the user"
                  value={mail}
                  variant="bordered"
                  onValueChange={setMail}
                />
                <Select
                  className="w-full"
                  label="Member Role"
                  placeholder="Select the role of the member"
                  selectedKeys={role}
                  variant="bordered"
                  onSelectionChange={(key: any) => setRole(key)}
                >
                  <SelectItem
                    key="Owner"
                    className="text-danger"
                    color="danger"
                  >
                    Owner
                  </SelectItem>
                  <SelectItem
                    key="Editor"
                    className="text-primary"
                    color="primary"
                  >
                    Editor
                  </SelectItem>
                  <SelectItem key="Viewer">Viewer</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoginLoading}
                  onPress={handleCreateAPIKey}
                >
                  Add Member
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
