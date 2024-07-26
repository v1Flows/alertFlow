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
  Select,
  SelectItem,
  Divider,
  Switch,
  cn,
  Snippet,
} from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LibraryIcon } from "lucide-react";
import { Icon } from "@iconify/react";

import { CheckIcon } from "@/components/icons";
import GetProjectRunners from "@/lib/fetch/project/runners";
import CreateFlow from "@/lib/fetch/flow/POST/CreateFlow";

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
  // limit on runner?
  const [runnerLimit, setRunnerLimit] = React.useState(false);
  // runner select list
  const [runners, setRunners] = React.useState([]);

  const projectSelected = async (e: any) => {
    setProjectId(e.currentKey);
    setRunnerId("");
    setRunners(await GetProjectRunners(e.currentKey));
  };

  const handleSelectRunner = (e: any) => {
    setRunnerId(e.currentKey);
  };

  async function createFlow() {
    setIsLoading(true);

    const response = await CreateFlow(
      name,
      description,
      projectId,
      runnerLimit ? runnerId : "any",
    );

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setName("");
      setDescription("");
      setProjectId("");
      setRunnerId("");
      setRunnerLimit(false);
      setIsLoading(false);
      onOpenChangeInstructions();
    } else {
      setIsLoading(false);
      toast.error("Failed to create flow");
    }
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
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold">
                <Icon icon="solar:book-bookmark-broken" width={24} /> Create
                Flow
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
                      Do you want to use a specific runner to execute your
                      actions on?
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
                <Button color="danger" variant="flat" onPress={cancel}>
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
                    Payload URL
                  </p>
                  <Snippet hideSymbol className="w-full">
                    {`${process.env.API_ENDPOINT}/payloads`}
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
