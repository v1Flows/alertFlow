"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import DisableUser from "@/lib/fetch/user/disable";
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
    const response = await DisableUser(user.id);

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
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-danger">
                <Icon icon="solar:sad-square-broken" width={24} /> Disable Your
                Account
              </ModalHeader>
              <ModalBody>
                <p className="text-center">
                  You are about to disable your account which can only be undone
                  by an support request.
                </p>
                <p className="text-center my-2 text-danger font-bold">
                  You will be logged out and will not be able to log in again.
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>Name: {user.username}</span>
                  <span>Email: {user.email}</span>
                  <span>ID: {user.id}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
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
