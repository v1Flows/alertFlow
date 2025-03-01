import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
} from "@heroui/react";
import React from "react";

export default function FunctionShowAlertModal({
  disclosure,
  alert,
}: {
  disclosure: UseDisclosureReturn;
  alert: any;
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
              <ModalHeader className="flex flex-col gap-1">Alert</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-default-500">Alert ID</p>
                  <Snippet hideSymbol>{alert.id}</Snippet>
                </div>
                <Snippet hideSymbol>
                  <pre>{JSON.stringify(alert.payload, null, 2)}</pre>
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
