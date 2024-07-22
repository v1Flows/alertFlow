import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Snippet,
} from "@nextui-org/react";

import { EyeIcon } from "@/components/icons";

export default function FunctionShowPayloadModal({
  disclosure,
  payload,
}: {
  disclosure: UseDisclosureReturn;
  payload: any;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = disclosure;

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Payload Content
              </ModalHeader>
              <ModalBody>
                <Snippet hideSymbol>
                  <pre>{JSON.stringify(payload.payload, null, 2)}</pre>
                </Snippet>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
