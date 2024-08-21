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

import DeleteUser from "@/lib/fetch/user/delete";

export default function DeleteUserModal({
  disclosure,
  user,
}: {
  disclosure: UseDisclosureReturn;
  user: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);

  async function deleteUser() {
    setIsLoading(true);
    const response = await DeleteUser();

    if (!response.error) {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
      toast.success("User deleted successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to delete user");
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
                <Icon icon="solar:sad-square-broken" width={24} /> Delete Your
                Account
              </ModalHeader>
              <ModalBody>
                <p className="text-center">
                  You are about to delete your account. This action{" "}
                  <span className="font-bold">cannot be undone</span>:
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
                  onPress={deleteUser}
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
