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
} from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

import { PlusIcon } from "@/components/icons";
import GetProjectRunners from "@/lib/fetch/project/runners";
import CreateFlow from "@/lib/fetch/flow/POST/CreateFlow";

export default function NewFlowModal({ projects }: any) {
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
      setName("");
      setDescription("");
      setProjectId("");
      setRunnerId("");
      setRunnerLimit(false);
      setIsLoading(false);
      onOpenChange();
      router.refresh();
      toast.success("Flow created successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to create flow");
    }
    onOpenChange();
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
      <Toaster richColors position="bottom-center" />
      <Button color="primary" radius="sm" variant="solid" onPress={onOpen}>
        <PlusIcon />
        New Flow
      </Button>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent className="w-full">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new Flow
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
                    {runners.map((runner: any) => (
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
    </>
  );
}
