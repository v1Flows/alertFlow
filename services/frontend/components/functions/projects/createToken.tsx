"use client";

import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import ErrorCard from "@/components/error/ErrorCard";
import CreateProjectToken from "@/lib/fetch/project/POST/CreateProjectToken";

export default function CreateProjectTokenModal({
  disclosure,
  projectID,
}: {
  disclosure: UseDisclosureReturn;
  projectID: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [description, setDescription] = React.useState("");
  const [expiresIn, setExpiresIn] = React.useState("1");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function handleCreateToken() {
    setIsLoading(true);

    const res = (await CreateProjectToken({
      projectId: projectID,
      expiresIn: expiresIn,
      description: description,
    })) as any;

    if (!res) {
      setIsLoading(false);
      setError(true);
      setErrorText("Failed to create api key");
      setErrorMessage("Failed to create api key");
      toast.error("Failed to create api key");

      return;
    }

    if (res.success) {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setError(true);
      setErrorText(res.error);
      setErrorMessage(res.message);
      toast.error("Failed to create api key");
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Create Project API Key</p>
                  <p className="text-sm text-default-500">
                    Create a new api key for your project.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <Input
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter the key description"
                  value={description}
                  variant="flat"
                  onValueChange={setDescription}
                />
                <Input
                  endContent="days"
                  label="Expires In"
                  labelPlacement="outside"
                  placeholder="Enter the api key expiration time"
                  type="number"
                  value={expiresIn}
                  variant="flat"
                  onValueChange={setExpiresIn}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="ghost" onPress={onClose}>
                  Discard
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
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
