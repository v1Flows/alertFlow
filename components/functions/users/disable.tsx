"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  Spacer,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";

import DisableUser from "@/lib/fetch/user/PUT/disable";
import { deleteSession } from "@/lib/auth/deleteSession";

export default function DisableUserModal({
  disclosure,
  user,
}: {
  disclosure: UseDisclosureReturn;
  user: any;
}) {
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);

  async function disableUser() {
    setIsLoading(true);
    const response = await DisableUser();

    if (!response.error) {
      setIsLoading(false);
      onOpenChange();
      toast.success("User disabled successfully");
      deleteSession();
    } else {
      setIsLoading(false);
      toast.error("Failed to disable user");
    }
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Are you sure?</p>
                  <p className="text-sm text-default-500">
                    You are about to disable your account which can only be
                    reverted by an support request.
                    <Spacer y={1} />
                    You will be logged out and will not be able to log in again.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Snippet hideCopyButton hideSymbol>
                  <span>Name: {user.username}</span>
                  <span>Email: {user.email}</span>
                  <span>ID: {user.id}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLoading}
                  variant="solid"
                  onPress={disableUser}
                >
                  Disable Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
