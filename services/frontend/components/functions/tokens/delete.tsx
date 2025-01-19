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

import DeleteRunnerToken from "@/lib/fetch/project/DELETE/DeleteRunnerToken";
import ErrorCard from "@/components/error/ErrorCard";

export default function DeleteTokenModal({
  disclosure,
  token,
}: {
  disclosure: UseDisclosureReturn;
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

    const response = (await DeleteRunnerToken(token.id)) as any;

    if (!response) {
      setIsLoading(false);
      setError(true);
      setErrorText("Failed to delete token");
      setErrorMessage("Failed to delete token");
      toast.error("Failed to delete token");

      return;
    }

    if (response.success) {
      setIsLoading(false);
      setError(false);
      setErrorText("");
      setErrorMessage("");
      router.refresh();
      onOpenChange();
      toast.success("Token deleted successfully");
    } else {
      setError(true);
      setErrorText(response.error);
      setErrorMessage(response.message);
      setIsLoading(false);
      toast.error("Failed to delete token");
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
                    You are about to delete the following token which{" "}
                    <span className="font-bold">cannot be undone</span>
                    .
                    <br /> Any runners using this token will become unusable.
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
