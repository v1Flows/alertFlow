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

import UpdateDoc from "@/lib/fetch/docs/PUT/update";

export default function EditDocumentModal({
  doc,
  disclosure,
}: {
  doc: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange } = disclosure;

  const [title, setTitle] = React.useState(doc.title);
  const [content, setContent] = React.useState(doc.content);
  const [category, setCategory] = React.useState(doc.category);
  const [hidden, setHidden] = React.useState(doc.hidden);

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSelectionChange = (e: any) => {
    setCategory(e.target.value);
  };

  async function updateDoc() {
    setIsLoading(true);

    const response = await UpdateDoc(doc.id, title, content, category, hidden);

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
      toast.success("Documentation updated successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to update documentation: " + response.error);
    }
  }

  function cancel() {
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
              <p className="text-lg font-bold">Update Documentation</p>
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
              <Button color="warning" isLoading={isLoading} onPress={updateDoc}>
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
