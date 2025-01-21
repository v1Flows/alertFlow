"use client";

import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import ErrorCard from "@/components/error/ErrorCard";
import DeleteProjectToken from "@/lib/fetch/project/DELETE/DeleteProjectToken";

export default function DeleteProjectTokenModal({
  disclosure,
  projectID,
  token,
}: {
  disclosure: UseDisclosureReturn;
  projectID: any;
  token: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function handleDeleteToken() {
    setIsLoading(true);

    const response = (await DeleteProjectToken(projectID, token.id)) as any;

    if (!response) {
      setIsLoading(false);
      setError(true);
      setErrorText("Failed to delete api key");
      setErrorMessage("Failed to delete api key");
      toast.error("Failed to delete api key");

      return;
    }

    if (response.success) {
      setIsLoading(false);
      setError(false);
      setErrorText("");
      setErrorMessage("");
      router.refresh();
      onOpenChange();
      toast.success("API Key deleted successfully");
    } else {
      setError(true);
      setErrorText(response.error);
      setErrorMessage(response.message);
      setIsLoading(false);
      toast.error("Failed to delete api key");
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
                  <p className="text-lg font-bold">Are you sure?</p>
                  <p className="text-sm text-default-500">
                    You are about to delete the following api key which{" "}
                    <span className="font-bold">cannot be undone</span>
                    .
                    <br /> this api key will become unusable.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <Snippet hideCopyButton hideSymbol>
                  <span>
                    ID:
                    {token.id}
                  </span>
                </Snippet>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  onPress={handleDeleteToken}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
