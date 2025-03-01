"use client";

import type { UseDisclosureReturn } from "@heroui/use-disclosure";

import { Icon } from "@iconify/react";
import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Snippet,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { LibraryIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import GetProjectRunners from "@/lib/fetch/project/runners";
import CreateFlow from "@/lib/fetch/flow/POST/CreateFlow";
import { CheckIcon } from "@/components/icons";
import ErrorCard from "@/components/error/ErrorCard";

export default function FunctionCreateFlow({
  projects,
  disclosure,
}: {
  projects: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  // create modal
  const { isOpen, onOpenChange } = disclosure;
  // instructions modal
  const { isOpen: isOpenInstructions, onOpenChange: onOpenChangeInstructions } =
    useDisclosure();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [projectId, setProjectId] = React.useState("");
  const [runnerId, setRunnerId] = React.useState("");

  // loading
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  // limit on runner?
  const [runnerLimit, setRunnerLimit] = React.useState(false);
  // runner select list
  const [runners, setRunners] = React.useState([]);

  const projectSelected = async (e: any) => {
    setProjectId(e.currentKey);
    setRunnerId("");
    const runners = await GetProjectRunners(e.currentKey);

    setRunners(runners.success ? runners.data.runners : []);
  };

  const handleSelectRunner = (e: any) => {
    setRunnerId(e.currentKey);
  };

  async function createFlow() {
    setIsLoading(true);

    const response = (await CreateFlow(
      name,
      description,
      projectId,
      runnerLimit ? runnerId : "any",
    )) as any;

    if (!response) {
      setError(true);
      setErrorText("Failed to create flow");
      setErrorMessage("Failed to create flow");
      setIsLoading(false);

      return;
    }

    if (response.success) {
      router.refresh();
      onOpenChange();
      setName("");
      setDescription("");
      setProjectId("");
      setRunnerId("");
      setRunnerLimit(false);
      setError(false);
      setErrorText("");
      setErrorMessage("");
      onOpenChangeInstructions();
    } else {
      setError(true);
      setErrorText(response.error);
      setErrorMessage(response.message);
      toast.error("Failed to create flow");
    }

    setIsLoading(false);
  }

  function cancel() {
    setName("");
    setDescription("");
    setProjectId("");
    setRunnerId("");
    setRunnerLimit(false);
    setIsLoading(false);
    onOpenChange();
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent className="w-full">
          {() => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Create new Flow</p>
                  <p className="text-sm text-default-500">
                    Flows are the entrypoint for incoming alerts. You define
                    actions and can view ongoing and completed executions.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <div className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter name"
                    type="name"
                    value={name}
                    variant="flat"
                    onValueChange={setName}
                  />
                  <Input
                    isRequired
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter description"
                    type="description"
                    value={description}
                    variant="flat"
                    onValueChange={setDescription}
                  />
                  <Select
                    isRequired
                    label="Project"
                    labelPlacement="outside"
                    placeholder="Select the project to assign the flow to"
                    selectedKeys={[projectId]}
                    variant="flat"
                    onSelectionChange={projectSelected}
                  >
                    {projects.map((project: any) => (
                      <SelectItem key={project.id}>{project.name}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex flex-col gap-2">
                    <div className="flex-cols flex items-center gap-2">
                      <p className="text-sm">Limit Runner</p>
                      <Tooltip content="You can specify a specific runner which should take care of executing your flow.">
                        <Icon
                          className="text-default-500"
                          icon="solar:info-circle-linear"
                          width={18}
                        />
                      </Tooltip>
                    </div>
                    <div>
                      <ButtonGroup radius="sm" variant="flat">
                        <Button
                          className={`${runnerLimit ? "bg-primary" : ""}`}
                          onPress={() => setRunnerLimit(true)}
                        >
                          <Icon
                            className="text-success"
                            icon="solar:check-circle-linear"
                            width={18}
                          />
                          Enabled
                        </Button>
                        <Button
                          className={`${!runnerLimit ? "bg-primary" : ""}`}
                          onPress={() => setRunnerLimit(false)}
                        >
                          <Icon
                            className="text-danger"
                            icon="solar:close-circle-linear"
                            width={18}
                          />
                          Disabled
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  {runnerLimit && (
                    <Select
                      label="Runner"
                      labelPlacement="outside"
                      placeholder="All Actions will be executed on this runner"
                      selectedKeys={[runnerId]}
                      variant="flat"
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={cancel}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={createFlow}
                >
                  Create Flow
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Instructions Modal */}

      <Modal
        backdrop="blur"
        isOpen={isOpenInstructions}
        placement="center"
        onOpenChange={onOpenChangeInstructions}
      >
        <ModalContent className="w-full">
          {(onInstructionsClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-success">
                Flow created successfully
              </ModalHeader>
              <ModalBody>
                <p>
                  Your new flow has been created successfully and is ready to be
                  used. You only have to use the Flow-ID and the API-URL which
                  can be found below.
                </p>
                <p>
                  If you need help with that please click on the documentation
                  link below.
                </p>
                <Divider />
                <div>
                  <p className="text-sm font-bold text-default-400">
                    Alert URL
                  </p>
                  <Snippet hideSymbol className="w-full">
                    {`${process.env.NEXT_PUBLIC_API_URL}/payloads`}
                  </Snippet>
                </div>
                <div>
                  <p className="text-sm font-bold text-default-400">Method</p>
                  <Snippet hideSymbol className="w-full">
                    POST
                  </Snippet>
                </div>
                <p className="text-sm font-bold text-default-400">
                  The Flow-ID can be found on the Flows page
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="bordered"
                  onPress={onInstructionsClose}
                >
                  <LibraryIcon />
                  Show Documentation
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={onInstructionsClose}
                >
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
