import { Icon } from "@iconify/react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import TimeAgo from "react-timeago";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

import { PlusIcon, VerticalDotsIcon } from "@/components/icons";
import RunnerPluginDrawer from "@/components/functions/runner/plugins";
import DeleteRunnerModal from "@/components/functions/runner/delete";
import CreateRunnerModal from "@/components/functions/runner/create";

export default function Runners({
  runners,
  project,
  settings,
  plan,
  user,
  members,
}: any) {
  const [targetRunner, setTargetRunner] = React.useState({} as any);
  const showRunnerPluginsDrawer = useDisclosure();
  const addRunnerModal = useDisclosure();
  const deleteRunnerModal = useDisclosure();

  const isMobile = useMediaQuery("(max-width: 650px)");

  const copyRunnerIDtoClipboard = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      toast.success("Runner ID copied to clipboard!");
    } else {
      toast.error("Failed to copy runner ID to clipboard");
    }
  };

  function heartbeatColor(runner: any) {
    const timeAgo =
      (new Date(runner.last_heartbeat).getTime() - Date.now()) / 1000;

    if (timeAgo < 0 && timeAgo > -30) {
      return "success";
    } else if (timeAgo <= -30 && timeAgo > -60) {
      return "warning";
    } else if (timeAgo <= -60) {
      return "danger";
    }
  }

  function heartbeatStatus(runner: any) {
    const timeAgo =
      (new Date(runner.last_heartbeat).getTime() - Date.now()) / 1000;

    if (timeAgo < 0 && timeAgo > -30) {
      return true;
    } else if (timeAgo <= -30) {
      return false;
    }
  }

  function checkQuotaDisabled() {
    if (!settings.create_runners) {
      return true;
    } else if (project.disabled) {
      return true;
    } else if (user.role === "vip") {
      return false;
    } else if (user.role === "admin") {
      return false;
    } else if (
      runners.filter((runner: any) => runner.alertflow_runner === false)
        .length >= plan.self_hosted_runners
    ) {
      return true;
    } else if (
      members.find((m: any) => m.user_id === user.id) &&
      members.filter((m: any) => m.user_id === user.id)[0].role === "Viewer"
    ) {
      return true;
    }

    return false;
  }

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg font-bold">Selfhosted Runners</p>
        <Button
          color="primary"
          isDisabled={checkQuotaDisabled()}
          isIconOnly={isMobile}
          startContent={<PlusIcon height={undefined} width={undefined} />}
          onPress={() => addRunnerModal.onOpen()}
        >
          {!isMobile && "Add Runner"}
        </Button>
      </div>
      <Divider className="mb-4" />
      <div className="flex flex-col gap-4">
        {runners.map(
          (runner: any) =>
            runner.alertflow_runner === false && (
              <Card key={runner.id}>
                <CardHeader className="items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                      <p className="text-md">{runner.name}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip
                          color={runner.disabled ? "danger" : "success"}
                          radius="sm"
                          size="sm"
                          variant="flat"
                        >
                          {runner.disabled ? "Disabled" : "Enabled"}
                        </Chip>
                        <Chip
                          color={heartbeatColor(runner)}
                          radius="sm"
                          size="sm"
                          variant="flat"
                        >
                          {heartbeatStatus(runner) ? "Healthy" : "Unhealthy"}
                        </Chip>
                      </div>
                    </div>
                    <p className="text-sm text-default-500">{runner.id}</p>
                  </div>
                  <div className="relative flex items-center justify-end gap-2">
                    <Dropdown backdrop="opaque">
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <VerticalDotsIcon
                            className="text-default-300"
                            height={undefined}
                            width={undefined}
                          />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownSection title="Actions">
                          <DropdownItem
                            key="copy"
                            startContent={
                              <Icon icon="solar:copy-outline" width={18} />
                            }
                            onPress={() => copyRunnerIDtoClipboard(runner.id)}
                          >
                            Copy ID
                          </DropdownItem>
                        </DropdownSection>
                        <DropdownSection title="Danger zone">
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            isDisabled={
                              members.find((m: any) => m.user_id === user.id) &&
                              members.filter(
                                (m: any) => m.user_id === user.id,
                              )[0].role === "Viewer"
                            }
                            startContent={
                              <Icon
                                icon="solar:trash-bin-trash-outline"
                                width={18}
                              />
                            }
                            onPress={() => {
                              setTargetRunner(runner);
                              deleteRunnerModal.onOpen();
                            }}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownSection>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col">
                  {runner.disabled && (
                    <p className="mb-4 text-center text-lg font-bold text-danger">
                      {runner.disabled_reason}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon
                          icon="solar:diploma-verified-outline"
                          width={20}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-md text-${runner.registered ? "success" : "danger"} font-bold`}
                        >
                          {runner.registered ? "Registered" : "Unregistered"}
                        </p>
                        <p className="text-sm text-default-500">
                          Authentication
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon icon="solar:heart-pulse-outline" width={20} />
                      </div>
                      <div>
                        <p
                          className={`text-md text-${heartbeatColor(runner)} font-bold`}
                        >
                          {runner.last_heartbeat !== "0001-01-01T00:00:00Z" && (
                            <TimeAgo date={runner.last_heartbeat} />
                          )}
                          {runner.last_heartbeat === "0001-01-01T00:00:00Z" &&
                            "N/A"}
                        </p>
                        <p className="text-sm text-default-500">
                          Last Heartbeat
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon
                          icon="solar:gamepad-minimalistic-outline"
                          width={20}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-md font-bold ${runner.executing_job && "text-success"}`}
                        >
                          {runner.executing_job ? "Executing Job" : "Idle"}
                        </p>
                        <p className="text-sm text-default-500">Status</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon icon="solar:sd-card-outline" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {runner.version ? runner.version : "N/A"}
                        </p>
                        <p className="text-sm text-default-500">Version</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon icon="solar:settings-linear" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold capitalize">
                          {runner.mode ? runner.mode : "N/A"}
                        </p>
                        <p className="text-sm text-default-500">Mode</p>
                      </div>
                    </div>

                    <Button
                      className="h-full"
                      variant="light"
                      onPress={() => {
                        setTargetRunner(runner);
                        showRunnerPluginsDrawer.onOpen();
                      }}
                    >
                      <div className="flex flex-col items-center justify-center	gap-1 hover:cursor-pointer hover:text-primary">
                        <Badge
                          isOneChar
                          color="default"
                          content={<Icon icon="solar:info-circle-linear" />}
                          placement="bottom-right"
                          shape="circle"
                          variant="faded"
                        >
                          <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                            <Icon icon="solar:plug-circle-outline" width={20} />
                          </div>
                        </Badge>
                        <div>
                          <p className="text-md font-bold">
                            {runner.plugins.length}
                          </p>
                          <p className="text-sm text-default-500">Plugins</p>
                        </div>
                      </div>
                    </Button>

                    <div className="flex flex-col items-center justify-center gap-1 hover:cursor-pointer hover:text-primary">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon icon="solar:bolt-outline" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {runner.actions.length}
                        </p>
                        <p className="text-sm text-default-500">Actions</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 hover:cursor-pointer hover:text-primary">
                      <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                        <Icon icon="solar:letter-opened-outline" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {runner.payload_endpoints.length}
                        </p>
                        <p className="text-sm text-default-500">
                          Payload Endpoints
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ),
        )}
      </div>

      <p className="my-4 text-lg font-bold">AlertFlow Runners</p>
      <Divider className="mb-4" />
      {project.alertflow_runners === true && (
        <div>
          <div className="grid gap-4 lg:grid-cols-2">
            {runners.map(
              (runner: any) =>
                runner.alertflow_runner === true && (
                  <Card key={runner.id}>
                    <CardHeader className="items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <p className="text-md">{runner.name}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Chip
                              color={runner.disabled ? "danger" : "success"}
                              radius="sm"
                              size="sm"
                              variant="flat"
                            >
                              {runner.disabled ? "Disabled" : "Enabled"}
                            </Chip>
                            <Chip
                              color={heartbeatColor(runner)}
                              radius="sm"
                              size="sm"
                              variant="flat"
                            >
                              {heartbeatStatus(runner)
                                ? "Healthy"
                                : "Unhealthy"}
                            </Chip>
                          </div>
                        </div>
                        <p className="text-sm text-default-500">{runner.id}</p>
                      </div>
                      <div className="relative flex items-center justify-end gap-2">
                        <Dropdown backdrop="opaque">
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                              <VerticalDotsIcon
                                className="text-default-300"
                                height={undefined}
                                width={undefined}
                              />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownSection title="Actions">
                              <DropdownItem
                                key="copy"
                                startContent={
                                  <Icon icon="solar:copy-outline" width={18} />
                                }
                                onPress={() =>
                                  copyRunnerIDtoClipboard(runner.id)
                                }
                              >
                                Copy ID
                              </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Danger zone">
                              <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                isDisabled={
                                  members.find(
                                    (m: any) => m.user_id === user.id,
                                  ) &&
                                  members.filter(
                                    (m: any) => m.user_id === user.id,
                                  )[0].role === "Viewer"
                                }
                                startContent={
                                  <Icon
                                    icon="solar:trash-bin-trash-outline"
                                    width={18}
                                  />
                                }
                                onPress={() => {
                                  setTargetRunner(runner);
                                  deleteRunnerModal.onOpen();
                                }}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownSection>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex flex-col">
                      {runner.disabled && (
                        <p className="mb-4 text-center text-lg font-bold text-danger">
                          {runner.disabled_reason}
                        </p>
                      )}
                      <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                            <Icon icon="solar:heart-pulse-outline" width={20} />
                          </div>
                          <div>
                            <p
                              className={`text-md text-${heartbeatColor(runner)} font-bold`}
                            >
                              {runner.last_heartbeat !==
                                "0001-01-01T00:00:00Z" && (
                                <TimeAgo date={runner.last_heartbeat} />
                              )}
                              {runner.last_heartbeat ===
                                "0001-01-01T00:00:00Z" && "N/A"}
                            </p>
                            <p className="text-sm text-default-500">
                              Last Heartbeat
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                            <Icon
                              icon="solar:gamepad-minimalistic-outline"
                              width={20}
                            />
                          </div>
                          <div>
                            <p
                              className={`text-md font-bold ${runner.executing_job && "text-success"}`}
                            >
                              {runner.executing_job ? "Executing Job" : "Idle"}
                            </p>
                            <p className="text-sm text-default-500">Status</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                            <Icon icon="solar:sd-card-outline" width={20} />
                          </div>
                          <div>
                            <p className="text-md font-bold">
                              {runner.runner_version
                                ? runner.runner_version
                                : "N/A"}
                            </p>
                            <p className="text-sm text-default-500">Version</p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ),
            )}
          </div>
        </div>
      )}
      {project.alertflow_runners === false && (
        <div>
          <p className="my-4 text-sm font-bold text-default-500">
            AlertFlow runners are disabled
          </p>
        </div>
      )}
      <RunnerPluginDrawer
        disclosure={showRunnerPluginsDrawer}
        runner={targetRunner}
      />
      <CreateRunnerModal
        alertflow_runner={false}
        disclosure={addRunnerModal}
        project={project}
      />
      <DeleteRunnerModal disclosure={deleteRunnerModal} runner={targetRunner} />
    </main>
  );
}
