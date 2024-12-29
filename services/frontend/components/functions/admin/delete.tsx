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
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import AdminDeleteUser from "@/lib/fetch/admin/DELETE/delete_user";
import ErrorCard from "@/components/error/ErrorCard";

export default function AdminDeleteUserModal({
  disclosure,
  user,
}: {
  disclosure: UseDisclosureReturn;
  user: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function deleteUser() {
    setIsLoading(true);
    const response = (await AdminDeleteUser(user.id)) as any;

    if (response.success) {
      router.refresh();
      onOpenChange();
      setError(false);
      setErrorMessage("");
      setErrorText("");
      toast.success("User deleted successfully");
    } else {
      setError(true);
      setErrorMessage(response.message);
      setErrorText(response.error);
      toast.error("Failed to delete user");
    }

    setIsLoading(false);
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
                    You are about to delete your account which{" "}
                    <span className="font-bold">cannot be undone</span>
                    .
                    <Spacer y={1} />
                    Any known data related to your account will be removed.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <Snippet hideCopyButton hideSymbol>
                  <span>
                    Name:
                    {user.username}
                  </span>
                  <span>
                    Email:
                    {user.email}
                  </span>
                  <span>
                    ID:
                    {user.id}
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
