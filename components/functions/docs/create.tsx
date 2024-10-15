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
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function CreateDocumentModal({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [hidden, setHidden] = React.useState(false);

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  // async function createDoc() {
  //   setIsLoading(true);

  //   const response = await CreateDoc(
  //     title,
  //     content,
  //     category,
  //     hidden,
  //   );

  //   if (response.result === "success") {
  //     router.refresh();
  //     onOpenChange();
  //     setTitle("");
  //     setContent("");
  //     setCategory("");
  //     setHidden(false);
  //     setIsLoading(false);
  //     onOpenChangeInstructions();
  //   } else {
  //     setIsLoading(false);
  //     toast.error("Failed to create document");
  //   }
  // }

  function cancel() {
    setTitle("");
    setContent("");
    setCategory("");
    setHidden(false);
    onOpenChange();
  }

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="w-full">
        {() => (
          <>
            <ModalHeader className="flex flex-wrap items-center">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold">Create new Document</p>
                <p className="text-sm text-default-500">
                  Flows are the entrypoint for incoming payloads. You define
                  actions and can view ongoing and completed executions.
                </p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Title"
                  labelPlacement="outside"
                  placeholder="Enter title"
                  type="name"
                  value={title}
                  variant="flat"
                  onValueChange={setTitle}
                />
                <Input
                  isRequired
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter description"
                  type="description"
                  value={content}
                  variant="flat"
                  onValueChange={setContent}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onPress={cancel}>
                Cancel
              </Button>
              <Button color="primary" isLoading={isLoading}>
                Create Document
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
