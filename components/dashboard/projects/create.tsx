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
  Divider,
  Switch,
  cn,
  Snippet,
} from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { LibraryIcon } from "lucide-react";

import { CheckIcon, PlusIcon } from "@/components/icons";
import CreateProject from "@/lib/fetch/project/POST/CreateProject";

export default function NewProjectModal() {
  const router = useRouter();

  // create modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // success modal
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onOpenChange: onOpenChangeSuccess,
  } = useDisclosure();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [alertflowRunners, setAlertflowRunners] = React.useState(false);

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  async function createProject() {
    setIsLoading(true);

    const response = await CreateProject(
      name,
      description,
      alertflowRunners,
      [],
    );

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      onOpenChangeSuccess();
      setName("");
      setDescription("");
      setAlertflowRunners(false);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Failed to create project");
    }
  }

  function cancel() {
    setName("");
    setDescription("");
    setAlertflowRunners(false);
    setIsLoading(false);
    onOpenChange();
  }

  return (
    <>
      <Toaster richColors position="bottom-center" />
      <Button color="primary" radius="sm" variant="solid" onPress={onOpen}>
        <PlusIcon />
        New Project
      </Button>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent className="w-full">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new Project
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter the project name"
                  type="name"
                  value={name}
                  variant="bordered"
                  onValueChange={setName}
                />
                <Input
                  isRequired
                  label="Description"
                  placeholder="Enter the project description"
                  type="description"
                  value={description}
                  variant="bordered"
                  onValueChange={setDescription}
                />
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
                  isSelected={alertflowRunners}
                  onValueChange={setAlertflowRunners}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-medium">Enable Alertflow Runners</p>
                    <p className="text-tiny text-default-400">
                      Do you want to enable Alertflow Runners? If you enable
                      this, actions will also be executed on runners hosted by
                      AlertFlow.
                    </p>
                  </div>
                </Switch>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={cancel}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={createProject}
                >
                  Create Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Instructions Modal */}

      <Modal
        backdrop="blur"
        isOpen={isOpenSuccess}
        placement="center"
        onOpenChange={onOpenChangeSuccess}
      >
        <ModalContent className="w-full">
          {(onInstructionsClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-success">
                Project created successfully
              </ModalHeader>
              <ModalBody>
                <p>
                  Your new project has been created successfully and is ready to be
                  used.
                </p>
                <p className="text-sm font-bold text-default-400">
                  The Project-ID can be found on the Projects page
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
