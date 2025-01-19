"use client";

import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { LibraryIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { CheckIcon } from "@/components/icons";

export default function SuccessSignUpModal({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  return (
    <>
      <Modal
        isDismissable
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1 text-success">
                🎉 Your Account got created
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-2">
                  <p>Thanks for signing up and 👋 Welcome to AlertFlow!</p>
                  <p className="text-default-500">
                    With the button press below you will be redirected to our
                    Homepage where you can login.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  <LibraryIcon />
                  Documentation
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={() => {
                    onOpenChange();
                    router.push("/");
                  }}
                >
                  <CheckIcon />
                  Understood
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
