"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";
import { LibraryIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import Welcomed from "@/lib/fetch/user/welcomed";

export default function WelcomeModal({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  async function handleSetWelcomed() {
    const response = await Welcomed();

    if (!response.error) {
      onOpenChange();
    } else {
      toast.error("Failed to set welcomed status");
    }
  }

  return (
    <>
      <Modal
        isDismissable
        backdrop="blur"
        className="border border-2 border-primary-200"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-cols items-center w-full justify-center">
                <div className="flex flex-cols gap-1 font-bold">
                  New here, huh?
                  <Icon icon="solar:cup-hot-linear" width={28} />
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-center text-lg">
                    Welcome to{" "}
                    <span className="font-semibold text-primary">
                      AlertFlow
                    </span>
                    ! We&apos;re thrilled to have you on board.
                  </p>
                  <p className="text-center text-md">
                    Click on the{" "}
                    <span className="font-bold">&quot;Documentation&quot;</span>{" "}
                    button below to dive in and learn how to make the most out
                    of{" "}
                    <span className="font-semibold text-primary">
                      AlertFlow
                    </span>
                    .
                  </p>
                  <p className="text-center text-md">
                    Or explore it on your own by clicking the{" "}
                    <span className="font-bold">&quot;Understood&quot;</span>{" "}
                    button.
                  </p>

                  <p className="text-sm text-default-500">
                    This dialog will not be shown to you again.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="bordered"
                  onPress={() => {
                    handleSetWelcomed();
                    router.push("/docs");
                    onClose();
                  }}
                >
                  <LibraryIcon />
                  Documentation
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={() => {
                    handleSetWelcomed();
                    onOpenChange();
                  }}
                >
                  <Icon icon="solar:telescope-linear" width={18} />
                  Start Exploring
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
