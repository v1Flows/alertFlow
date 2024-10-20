import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Button,
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "sonner";
import React from "react";
import TimeAgo from "react-timeago";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";

import { VerticalDotsIcon, PlusIcon } from "@/components/icons";
import CreateRunnerModal from "@/components/functions/runner/create";
import DeleteRunnerModal from "@/components/functions/runner/delete";

export default function Runners({
  runners,
  project,
  settings,
  plan,
  user,
  members,
}: any) {
  const [targetRunner, setTargetRunner] = React.useState({} as any);
  const addRunnerModal = useDisclosure();
  const deleteRunnerModal = useDisclosure();

  const isMobile = useMediaQuery("(max-width: 650px)");

  const copyRunnerIDtoClipboard = (id: string) => {
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // eslint-disable-next-line no-undef
      navigator.clipboard.writeText(id);
      toast.success("Runner ID copied to clipboard!");
    } else {
      toast.error("Failed to copy runner ID to clipboard");
    }
  };

  function heartbeatColor(runner: any) {
    var timeAgo =
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
    var timeAgo =
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
    } else if (user.role === "VIP") {
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
      <div className="flex items-center justify-between mb-4">
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
      <div className="grid lg:grid-cols-2 gap-4">
        {runners.map(
          (runner: any) =>
            runner.alertflow_runner === false && (
              <Card key={runner.id}>
                <CardHeader className="justify-between items-center">
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
                  <div className="relative flex justify-end items-center gap-2">
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
                            startContent={
                              <Icon icon="solar:copy-outline" width={18} />
                            }
                            onClick={() => copyRunnerIDtoClipboard(runner.id)}
                          >
                            Copy ID
                          </DropdownItem>
                        </DropdownSection>
                        <DropdownSection title="Danger zone">
                          <DropdownItem
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
                            onClick={() => {
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
                    <p className="text-lg mb-4 font-bold text-danger text-center">
                      {runner.disabled_reason}
                    </p>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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
                      <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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
                      <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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
                      <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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

                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                        <Icon icon="solar:bolt-outline" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {runner.available_actions.length}
                        </p>
                        <p className="text-sm text-default-500">Avl. Actions</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                        <Icon icon="solar:letter-opened-outline" width={20} />
                      </div>
                      <div>
                        <p className="text-md font-bold">
                          {runner.available_payload_injectors.length}
                        </p>
                        <p className="text-sm text-default-500">
                          Avl. Payload Injectors
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ),
        )}
      </div>

      <p className="text-lg font-bold mt-4 mb-4">AlertFlow Runners</p>
      <Divider className="mb-4" />
      {project.alertflow_runners === true && (
        <div>
          <div className="grid lg:grid-cols-2 gap-4">
            {runners.map(
              (runner: any) =>
                runner.alertflow_runner === true && (
                  <Card key={runner.id}>
                    <CardHeader className="justify-between items-center">
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
                      <div className="relative flex justify-end items-center gap-2">
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
                                startContent={
                                  <Icon icon="solar:copy-outline" width={18} />
                                }
                                onClick={() =>
                                  copyRunnerIDtoClipboard(runner.id)
                                }
                              >
                                Copy ID
                              </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Danger zone">
                              <DropdownItem
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
                                onClick={() => {
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
                        <p className="text-lg mb-4 font-bold text-danger text-center">
                          {runner.disabled_reason}
                        </p>
                      )}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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
                          <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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
                          <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
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
          <p className="text-sm text-default-500 font-bold mt-4 mb-4">
            AlertFlow runners are disabled
          </p>
        </div>
      )}
      <CreateRunnerModal
        alertflow_runner={false}
        disclosure={addRunnerModal}
        project={project}
      />
      <DeleteRunnerModal disclosure={deleteRunnerModal} runner={targetRunner} />
    </main>
  );
}
