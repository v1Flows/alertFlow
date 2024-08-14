"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tooltip,
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
import { InfoIcon } from "@/components/icons";
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
    setIcons(() => listIcons("", "solar"));
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
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Create new project</p>
                  <p className="text-sm text-default-500">
                    Projects are where you manage team members, create flows or
                    runners. Depending on your Plan you also see Audit logs.{" "}
                  </p>
                </div>
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
                <div className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter name"
                    radius="sm"
                    type="name"
                    value={name}
                    variant="flat"
                    onValueChange={setName}
                  />
                  <Input
                    isRequired
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter the project description"
                    radius="sm"
                    type="description"
                    value={description}
                    variant="flat"
                    onValueChange={setDescription}
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-cols items-center gap-2">
                      <p className="text-sm">AlertFlow Runners</p>
                      <Tooltip
                        content="We are hosting our own Runners to make the usage of
                        AlertFlow for you easier. With this option you can
                        either enable or disable the usage of them."
                      >
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
                          className={`${alertflowRunners ? "bg-primary" : ""}`}
                          onPress={() => setAlertflowRunners(true)}
                        >
                          <Icon
                            className="text-success"
                            icon="solar:check-circle-linear"
                            width={18}
                          />
                          Enabled
                        </Button>
                        <Button
                          className={`${!alertflowRunners ? "bg-primary" : ""}`}
                          onPress={() => setAlertflowRunners(false)}
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
                </div>
                <Divider />
                <Select
                  items={icons.map((icon) => ({ textValue: icon }))}
                  label="Icon"
                  labelPlacement="outside"
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
