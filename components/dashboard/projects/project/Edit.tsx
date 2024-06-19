"use client";

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
  Switch,
  cn,
} from "@nextui-org/react";

import { EditDocumentIcon } from "@/components/icons";

export default function EditProjectModal({ project }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="warning"
        endContent={<EditDocumentIcon />}
        variant="flat"
        onPress={onOpen}
      >
        Edit Project
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Project
              </ModalHeader>
              <ModalBody>
                <Input
                  defaultValue={project.name}
                  label="Name"
                  name="name"
                  placeholder="Enter the project name"
                  variant="bordered"
                />
                <Input
                  defaultValue={project.description}
                  label="Description"
                  name="description"
                  placeholder="Enter the project description"
                  variant="bordered"
                />
                <Switch
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                      "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                      "data-[selected=true]:border-primary",
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 border-2 shadow-lg",
                      "group-data-[hover=true]:border-primary",
                      //selected
                      "group-data-[selected=true]:ml-6",
                      // pressed
                      "group-data-[pressed=true]:w-7",
                      "group-data-[selected]:group-data-[pressed]:ml-4",
                    ),
                  }}
                  defaultSelected={project.alertflow_runners}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-medium">Enable AlertFlow Runners</p>
                    <p className="text-tiny text-default-400">
                      Enable or disable AlertFlow runners.
                    </p>
                  </div>
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Discard
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
