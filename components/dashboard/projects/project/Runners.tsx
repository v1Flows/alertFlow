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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Snippet,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React from "react";
import TimeAgo from "react-timeago";

import {
  VerticalDotsIcon,
  DeleteDocumentIcon,
  CopyDocumentIcon,
  InfoIcon,
  PlusIcon,
} from "@/components/icons";
import DeleteProjectRunner from "@/lib/fetch/project/DELETE/DeleteRunner";
import CreateRunnerModal from "@/components/functions/runner/create";
import DeleteRunnerModal from "@/components/functions/runner/delete";

export default function Runners({ runners, project, settings }: any) {
  const [targetRunner, setTargetRunner] = React.useState({} as any);
  const addRunnerModal = useDisclosure();
  const deleteRunnerModal = useDisclosure();

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

  return (
    <main>
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold">Selfhosted Runners</p>
        <Button
          color="primary"
          endContent={<PlusIcon height={undefined} width={undefined} />}
          isDisabled={!settings.create_runners || project.disabled}
          onPress={() => addRunnerModal.onOpen()}
        >
          Add Runner
        </Button>
      </div>
      <Divider className="mb-4" />
      <div className="grid lg:grid-cols-2 gap-4">
        {runners.map(
          (runner: any) =>
            runner.alertflow_runner === false && (
              <Card key={runner.id}>
                <CardHeader className="justify-between items-center">
                  <div>
                    <p className="text-md">{runner.name}</p>
                    <p className="text-sm text-default-500">{runner.id}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip
                      color={runner.registered ? "success" : "danger"}
                      size="sm"
                      variant="dot"
                    >
                      {runner.registered ? "Registered" : "Unregistered"}
                    </Chip>
                    <Chip
                      color={heartbeatColor(runner)}
                      size="sm"
                      variant="flat"
                    >
                      {heartbeatStatus(runner) ? "Healthy" : "Unhealthy"}
                    </Chip>
                    <Chip
                      color={runner.disabled ? "danger" : "success"}
                      size="sm"
                      variant="flat"
                    >
                      {runner.disabled ? "Disabled" : "Enabled"}
                    </Chip>
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
                              startContent={<CopyDocumentIcon />}
                              onClick={() => copyRunnerIDtoClipboard(runner.id)}
                            >
                              Copy ID
                            </DropdownItem>
                          </DropdownSection>
                          <DropdownSection title="Danger zone">
                            <DropdownItem
                              className="text-danger"
                              color="danger"
                              startContent={<DeleteDocumentIcon />}
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
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-2 grid-rows-3 items-center justify-center">
                    <p className="text-sm">Version:</p>
                    <p className="text-sm">{runner.runner_version}</p>
                    <p className="text-sm">Active:</p>
                    <p className="text-sm">{runner.active ? "Yes" : "No"}</p>
                    <p className="text-sm">Last Heartbeat:</p>
                    <p
                      className={"text-" + heartbeatColor(runner) + " text-sm"}
                    >
                      {runner.last_heartbeat !== "0001-01-01T00:00:00Z" && (
                        <TimeAgo date={runner.last_heartbeat} />
                      )}
                      {runner.last_heartbeat === "0001-01-01T00:00:00Z" &&
                        "N/A"}
                    </p>
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
                      <div>
                        <p className="text-md">{runner.name}</p>
                        <p className="text-sm text-default-500">{runner.id}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip
                          color={heartbeatColor(runner)}
                          size="sm"
                          variant="flat"
                        >
                          {heartbeatStatus(runner) ? "Healthy" : "Unhealthy"}
                        </Chip>
                        <Chip
                          color={runner.disabled ? "danger" : "success"}
                          size="sm"
                          variant="flat"
                        >
                          {runner.disabled ? "Disabled" : "Enabled"}
                        </Chip>
                        {runner.disabled && (
                          <Chip
                            color={runner.disabled ? "danger" : "success"}
                            size="sm"
                            variant="flat"
                          >
                            Disabled Reason: {runner.disabled_reason}
                          </Chip>
                        )}
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <div className="grid grid-cols-2 grid-rows-3 items-center justify-center">
                        <p className="text-sm">Version:</p>
                        <p className="text-sm">{runner.runner_version}</p>
                        <p className="text-sm">Active:</p>
                        <p className="text-sm">
                          {runner.active ? "Yes" : "No"}
                        </p>
                        <p className="text-sm">Last Heartbeat:</p>
                        <p
                          className={
                            "text-" + heartbeatColor(runner) + " text-sm"
                          }
                        >
                          {runner.last_heartbeat !== "0001-01-01T00:00:00Z" && (
                            <TimeAgo date={runner.last_heartbeat} />
                          )}
                          {runner.last_heartbeat === "0001-01-01T00:00:00Z" &&
                            "N/A"}
                        </p>
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
