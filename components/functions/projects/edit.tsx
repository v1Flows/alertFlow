"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { EditDocumentIcon } from "@/components/icons";
import UpdateProject from "@/lib/fetch/project/PUT/UpdateProject";

export default function EditProjectModal({
  disclosure,
  project,
}: {
  disclosure: UseDisclosureReturn;
  project: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [name, setName] = React.useState(project.name);
  const [description, setDescription] = React.useState(project.description);
  const [alertflowRunners, setAlertflowRunners] = React.useState(
    project.alertflow_runners,
  );
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    setAlertflowRunners(project.alertflow_runners);
  }, [project]);

  async function updateProject() {
    setIsLoading(true);
    const response = await UpdateProject(
      project.id,
      name,
      description,
      alertflowRunners,
    );

    if (!response.error) {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
      toast.success("Project updated successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to update project");
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-warning">
                <EditDocumentIcon />
                Edit Project
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  name="name"
                  placeholder="Enter the project name"
                  value={name}
                  variant="bordered"
                  onValueChange={setName}
                />
                <Input
                  label="Description"
                  name="description"
                  placeholder="Enter the project description"
                  value={description}
                  variant="bordered"
                  onValueChange={setDescription}
                />
                <Switch
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                      "justify-between cursor-pointer rounded-2xl gap-2 p-4 border-2 border-transparent",
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
                  isSelected={alertflowRunners}
                  onValueChange={setAlertflowRunners}
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
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={updateProject}
                >
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
