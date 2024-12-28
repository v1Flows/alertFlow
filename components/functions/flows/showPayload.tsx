import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
} from "@nextui-org/react";
import React from "react";

export default function FunctionShowPayloadModal({
  disclosure,
  payload,
}: {
  disclosure: UseDisclosureReturn;
  payload: any;
}) {
  const { isOpen, onOpenChange } = disclosure;

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
              <ModalHeader className="flex flex-col gap-1">Payload</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-default-500">Payload ID</p>
                  <Snippet hideSymbol>{payload.id}</Snippet>
                </div>
                <Snippet hideSymbol>
                  <pre>{JSON.stringify(payload.payload, null, 2)}</pre>
                </Snippet>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="ghost" onPress={onClose}>
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
