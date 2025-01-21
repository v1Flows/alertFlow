"use client";

import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import {
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import ErrorCard from "@/components/error/ErrorCard";
import AdminUpdateToken from "@/lib/fetch/admin/PUT/EditToken";

export default function AdminEditTokenModal({
  token,
  disclosure,
}: {
  token: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  // create modal
  const { isOpen, onOpenChange, onClose } = disclosure;

  const [disabled, setDisabled] = useState(token.disabled);
  const [disabledReason, setDisabledReason] = useState(token.disabled_reason);
  const [description, setDescription] = useState(token.description);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDescription(token.description);
  }, [token]);

  async function updateToken() {
    setIsLoading(true);

    const response = (await AdminUpdateToken(
      token.id,
      disabled,
      disabledReason,
      description,
    )) as any;

    if (!response) {
      setIsLoading(false);
      setError(true);
      setErrorText("Failed to update token");
      setErrorMessage("Failed to update token");
      toast.error("Failed to update token");

      return;
    }

    if (response.success) {
      setIsLoading(false);
      setError(false);
      setErrorText("");
      setErrorMessage("");
      router.refresh();
      onOpenChange();
    } else {
      setIsLoading(false);
      setError(true);
      setErrorText(response.error);
      setErrorMessage(response.message);
      toast.error("Failed to update token");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Edit Token</p>
                  <p className="text-sm text-default-500">
                    Edit the token details below and click apply changes to
                    save.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm font-bold">Status</p>
                  <ButtonGroup>
                    <Button
                      color={!disabled ? "success" : "default"}
                      value={disabled}
                      variant={!disabled ? "flat" : "bordered"}
                      onPress={() => setDisabled(false)}
                    >
                      Enabled
                    </Button>
                    <Button
                      color={disabled ? "danger" : "default"}
                      value={disabled}
                      variant={disabled ? "flat" : "bordered"}
                      onPress={() => setDisabled(true)}
                    >
                      Disabled
                    </Button>
                  </ButtonGroup>
                </div>
                {disabled && (
                  <Input
                    isRequired
                    label="Disabled Reason"
                    labelPlacement="outside"
                    placeholder="Enter the reason for disabling the token"
                    type="description"
                    value={disabledReason}
                    variant="flat"
                    onValueChange={setDisabledReason}
                  />
                )}
                <Input
                  isRequired
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter the flow description"
                  type="description"
                  value={description}
                  variant="flat"
                  onValueChange={setDescription}
                />
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={updateToken}
                >
                  Apply Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
