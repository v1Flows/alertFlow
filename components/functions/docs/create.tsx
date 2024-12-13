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
  Input,
  ButtonGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import MarkdownEditor from "@uiw/react-markdown-editor";

import CreateDoc from "@/lib/fetch/docs/POST/create";

export default function CreateDocumentModal({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState("Common");
  const [hidden, setHidden] = React.useState(false);

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSelectionChange = (e: any) => {
    setCategory(e.target.value);
  };

  async function createDoc() {
    setIsLoading(true);

    const response = await CreateDoc(title, content, category, hidden);

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setTitle("");
      setContent("");
      setCategory("");
      setHidden(false);
      setIsLoading(false);
      toast.success("Document created successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to create document: " + response.error);
    }
  }

  function cancel() {
    setTitle("");
    setContent("");
    setCategory("");
    setHidden(false);
    onOpenChange();
  }

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="w-full">
        {() => (
          <>
            <ModalHeader className="flex flex-wrap items-center">
              <p className="text-lg font-bold">Create new Document</p>
            </ModalHeader>
            <ModalBody className="max-h-[70vh] overflow-y-auto">
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
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Content</p>
                  <MarkdownEditor
                    value={content}
                    onChange={(value: any) => setContent(value)}
                  />
                </div>
                <Select
                  disallowEmptySelection
                  isRequired
                  label="Category"
                  labelPlacement="outside"
                  selectedKeys={[category]}
                  variant="flat"
                  onChange={handleSelectionChange}
                >
                  <SelectItem key="Common">Common</SelectItem>
                  <SelectItem key="Getting Started">Getting Started</SelectItem>
                  <SelectItem key="Help">Help</SelectItem>
                  <SelectItem key="Flows">Flows</SelectItem>
                  <SelectItem key="Projects">Projects</SelectItem>
                  <SelectItem key="Runners">Runners</SelectItem>
                  <SelectItem key="Payloads">Payloads</SelectItem>
                  <SelectItem key="Executions">Executions</SelectItem>
                  <SelectItem key="Actions">Actions</SelectItem>
                </Select>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Hidden</p>
                  <div>
                    <ButtonGroup radius="sm" variant="flat">
                      <Button
                        className={`${!hidden ? "bg-primary" : ""}`}
                        onPress={() => setHidden(false)}
                      >
                        <Icon
                          className="text-success"
                          icon="solar:eye-broken"
                          width={18}
                        />
                        Visible
                      </Button>
                      <Button
                        className={`${hidden ? "bg-primary" : ""}`}
                        onPress={() => setHidden(true)}
                      >
                        <Icon
                          className="text-warning"
                          icon="solar:eye-closed-bold-duotone"
                          width={18}
                        />
                        Hidden
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onPress={cancel}>
                Cancel
              </Button>
              <Button color="primary" isLoading={isLoading} onPress={createDoc}>
                Create Document
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
