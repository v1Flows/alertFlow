"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import AdminSendUserNotification from "@/lib/fetch/admin/sendUserNotification";

export default function AdminSendUserNotificationModal({
  user,
  disclosure,
}: {
  user: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange, onClose } = disclosure;

  const [text, setText] = React.useState("");

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  async function sendNotification() {
    setIsLoading(true);
    const response = await AdminSendUserNotification(user.id, text);

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
      setText("");
      toast.success("Notification sent successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to send notification");
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
                  <p className="text-lg font-bold">
                    Send Notification to {user.username}
                  </p>
                  <p className="text-sm text-default-500">
                    The below message will be displayed to {user.username} when
                    they login.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Textarea
                  isRequired
                  label="Text"
                  labelPlacement="outside"
                  placeholder=""
                  type="name"
                  value={text}
                  variant="bordered"
                  onValueChange={setText}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={sendNotification}
                >
                  <Icon icon="solar:map-arrow-right-bold-duotone" width={22} />
                  Send Notification
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
