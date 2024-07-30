"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Divider,
  Switch,
  cn,
} from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Flash } from "@/components/icons";
import GetProjectRunners from "@/lib/fetch/project/runners";
import UpdateFlow from "@/lib/fetch/flow/PUT/UpdateFlow";

export default function EditFlowModal({
  flow,
  projects,
  disclosure,
}: {
  flow: any;
  projects: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  // create modal
  const { isOpen, onOpenChange, onClose } = disclosure;

  const [name, setName] = React.useState(flow.name);
  const [description, setDescription] = React.useState(flow.description);
  const [projectId, setProjectId] = React.useState(flow.project_id);
  const [runnerId, setRunnerId] = React.useState(flow.runner_id);

  // loading
  const [isLoading, setIsLoading] = React.useState(false);
  // limit on runner?
  const [runnerLimit, setRunnerLimit] = React.useState(
    flow.runner_id !== "any" ? true : false,
  );
  // runner select list
  const [runners, setRunners] = React.useState([]);

  useEffect(() => {
    setName(flow.name);
    setDescription(flow.description);
    setProjectId(flow.project_id);
    setRunnerId(flow.runner_id);
    setRunnerLimit(flow.runner_id !== "any" ? true : false);
    getCurrentProjectRunners();
  }, [flow]);

  async function getCurrentProjectRunners() {
    setRunners(await GetProjectRunners(flow.project_id));
  }

  const projectSelected = async (e: any) => {
    setProjectId(e.currentKey);
    setRunnerId("");
    setRunners(await GetProjectRunners(e.currentKey));
  };

  const handleSelectRunner = (e: any) => {
    setRunnerId(e.currentKey);
  };

  async function editFlow() {
    setIsLoading(true);

    const response = await UpdateFlow(
      flow.id,
      name,
      description,
      projectId,
      runnerLimit ? runnerId : "any",
    );

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Failed to update flow");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-warning">
                <Flash size={20} /> Edit Flow
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter the flow name"
                  type="name"
                  value={name}
                  variant="bordered"
                  onValueChange={setName}
                />
                <Input
                  isRequired
                  label="Description"
                  placeholder="Enter the flow description"
                  type="description"
                  value={description}
                  variant="bordered"
                  onValueChange={setDescription}
                />
                <Select
                  isRequired
                  label="Project"
                  placeholder="Select the project to assign the flow to"
                  selectedKeys={[projectId]}
                  variant="bordered"
                  onSelectionChange={projectSelected}
                >
                  {projects.map((project: any) => (
                    <SelectItem key={project.id}>{project.name}</SelectItem>
                  ))}
                </Select>
                <Divider />
                <Switch
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                      "justify-between cursor-pointer rounded-lg gap-2 p-3 border-2 border-content3",
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
                  isSelected={runnerLimit}
                  onValueChange={setRunnerLimit}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-medium">Limit Runner</p>
                    <p className="text-tiny text-default-400">
                      Do you want to use a certain runner to run your
                      executions?
                    </p>
                  </div>
                </Switch>
                {runnerLimit && (
                  <Select
                    label="Runner"
                    placeholder="All Actions will be executed on this runner"
                    selectedKeys={[runnerId]}
                    variant="bordered"
                    onSelectionChange={handleSelectRunner}
                  >
                    {runners
                      .filter(
                        (runner: any) => runner.alertflow_runner === false,
                      )
                      .map((runner: any) => (
                        <SelectItem key={runner.id}>{runner.name}</SelectItem>
                      ))}
                  </Select>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={editFlow}
                >
                  Apply Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
