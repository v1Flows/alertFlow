"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  User,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import RemoveProjectMember from "@/lib/fetch/project/DELETE/removeProjectMember";

export default function DeleteProjectMemberModal({
  disclosure,
  projectID,
  user,
}: {
  disclosure: UseDisclosureReturn;
  projectID: string;
  user: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const statusColorMap: any = {
    Owner: "danger",
    Editor: "primary",
    Viewer: "default",
  };

  async function handleDeleteMember() {
    setIsDeleteLoading(true);

    const res = await RemoveProjectMember(projectID, user.user_id);

    if (res.error) {
      setIsDeleteLoading(false);
      toast.error(res.error);

      return;
    } else {
      setIsDeleteLoading(false);
      onOpenChange();
      toast.success("Member removed successfully");
      router.refresh();
    }

    setIsDeleteLoading(false);
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Remove Member</p>
                  <p className="text-sm text-default-500">
                    By removing this member, they will no longer have access to
                    the project.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <User
                  avatarProps={{ radius: "lg", name: user.username }}
                  className="justify-start"
                  description={user.email}
                  name={
                    <div className="flex items-center gap-2">
                      <p>{user.username}</p>
                      <Chip
                        className="capitalize"
                        color={statusColorMap[user.role]}
                        size="sm"
                        variant="flat"
                      >
                        {user.role}
                      </Chip>
                    </div>
                  }
                />
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleteLoading}
                  onPress={handleDeleteMember}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
