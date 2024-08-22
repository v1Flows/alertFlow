"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import LeaveProject from "@/lib/fetch/project/DELETE/leave";

export default function LeaveProjectModal({
  disclosure,
  projectID,
}: {
  disclosure: UseDisclosureReturn;
  projectID: string;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);

  async function handleLeaveProject() {
    setIsLeaveLoading(true);

    const res = await LeaveProject(projectID);

    if (res.error) {
      setIsLeaveLoading(false);
      toast.error(res.error);

      return;
    } else {
      setIsLeaveLoading(false);
      onOpenChange();
      toast.success("You have left the project successfully");
      router.push("/dashboard/projects");
    }

    setIsLeaveLoading(false);
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
                    You will lose all access to this project. You can always rejoin if you are invited back.
                  </p>
                </div>
              </ModalHeader>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isLeaveLoading}
                  onPress={handleLeaveProject}
                >
                  Leave Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
