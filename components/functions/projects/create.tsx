"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Avatar,
  Button,
  Card,
  CardHeader,
  cn,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { LibraryIcon } from "lucide-react";
import { Icon, listIcons, loadIcons } from "@iconify/react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import CreateProject from "@/lib/fetch/project/POST/CreateProject";
import { CheckIcon, InfoIcon } from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";

export default function CreateProjectModal({
  disclosure,
}: {
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;
  const [icons, setIcons] = React.useState<string[]>([]);

  // success modal
  const { isOpen: isOpenSuccess, onOpenChange: onOpenChangeSuccess } =
    useDisclosure();

  const [color, setColor] = useColor("#5213d7");
  const [projectIcon, setProjectIcon] = React.useState("solar:home-2-linear");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [alertflowRunners, setAlertflowRunners] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    loadAllSolarIcons();
  }, []);

  async function loadAllSolarIcons() {
    await loadIcons(["solar:home-2-linear", "solar:atom-broken"]);
    setIcons((prevIcons) => listIcons("", "solar"));
  }

  const handleIconChange = (e: any) => {
    setProjectIcon(e.target.value);
  };

  async function createProject() {
    setIsLoading(true);

    const response = await CreateProject(
      name,
      description,
      alertflowRunners,
      projectIcon,
      color.hex,
    );

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      onOpenChangeSuccess();
      setName("");
      setDescription("");
      setAlertflowRunners(false);
      setIsLoading(false);
      setError(false);
      setErrorText("");
    } else {
      setIsLoading(false);
      setError(true);
      setErrorText(response.error);
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
      <Modal
        isOpen={isOpen}
        placement="center"
        size="xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {() => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold">
                <Icon icon="solar:box-broken" width={24} /> Create Project
              </ModalHeader>
              <ModalBody>
                {error && (
                  <Card className="border border-danger-300 border-2">
                    <CardHeader className="justify-start gap-2 items-center">
                      <IconWrapper className="bg-danger/10 text-danger">
                        <InfoIcon className="text-lg" />
                      </IconWrapper>
                      <p className="text-md font-bold text-danger">
                        {errorText}
                      </p>
                    </CardHeader>
                  </Card>
                )}
                <div className="grid lg:grid-cols-2 gap-2">
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
                </div>
                <Switch
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-full bg-content1 hover:bg-content2 items-center",
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
                <Divider />
                <Select
                  items={icons.map((icon) => ({ textValue: icon }))}
                  label="Icon"
                  placeholder="Select an icon"
                  selectedKeys={[projectIcon]}
                  size="md"
                  startContent={<Icon icon={projectIcon} width={22} />}
                  onChange={handleIconChange}
                >
                  {(item) => (
                    <SelectItem key={item.textValue} textValue={item.textValue}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          className="flex-shrink-0"
                          color="primary"
                          icon={<Icon icon={item.textValue} width={22} />}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{item.textValue}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <div>
                  <p className="font-bold">Project Color</p>
                  <p className="text-sm text-default-500">
                    This color appears on the project list
                  </p>
                </div>
                <ColorPicker hideInput color={color} onChange={setColor} />
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
        size="lg"
        onOpenChange={onOpenChangeSuccess}
      >
        <ModalContent className="w-full">
          {(onInstructionsClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center text-success">
                <Icon icon="solar:verified-check-broken" width={58} />
                <p className="text-xl font-bold">
                  Project successfully created
                </p>
              </ModalHeader>
              <ModalBody className="text-center">
                <p>
                  Your new project has been created successfully and is ready to
                  be used.
                </p>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
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
                  <Icon icon="solar:glasses-line-duotone" width={20} />
                  Start Exploring
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
