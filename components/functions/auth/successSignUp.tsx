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

import { CheckIcon } from "@/components/icons";
import { useRouter } from "next/navigation";

export default function SuccessSignUpModal({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = disclosure;

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
              <ModalHeader className="flex flex-col gap-1 text-success items-center">
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
                <Button color="primary" variant="solid" onPress={() => router.push("/")}>
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
