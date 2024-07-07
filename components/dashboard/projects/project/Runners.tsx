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
import { Toaster, toast } from "sonner";
import React from "react";
import TimeAgo from "react-timeago";

import {
  VerticalDotsIcon,
  DeleteDocumentIcon,
  CopyDocumentIcon,
  InfoIcon,
} from "@/components/icons";
import DeleteProjectRunner from "@/lib/fetch/project/DELETE/DeleteRunner";
import AddRunnerModal from "@/components/dashboard/projects/project/modals/AddRunner";

export default function Runners({ runners, project, settings }: any) {
  const router = useRouter();

  // delete runner things
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [runnerToDelete, setRunnerToDelete] = React.useState("");
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

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

  function handleDeleteRunner(runnerID: any) {
    setRunnerToDelete(runnerID);
    onOpenChange();
  }

  async function deleteRunner() {
    setIsDeleteLoading(true);
    const response = await DeleteProjectRunner(runnerToDelete);

    if (response.result === "success") {
      setRunnerToDelete("");
      setIsDeleteLoading(false);
      onOpenChange();
      toast.success("Runner deleted successfully");
      router.refresh();
    } else {
      setIsDeleteLoading(false);
      toast.error("Failed to delete runner");
    }
  }

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
      <Toaster richColors position="bottom-center" />
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold">Selfhosted Runners</p>
        <AddRunnerModal projectID={project.id} settings={settings} />
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
                              onClick={() => handleDeleteRunner(runner.id)}
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
                      <TimeAgo date={runner.last_heartbeat} />
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
                          <TimeAgo date={runner.last_heartbeat} />
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
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-danger">
                <InfoIcon />
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p>
                  You are about to delete the following runner which{" "}
                  <span className="font-bold">cannot be undone.</span>
                </p>
                <p className="items-center">
                  Any Flow which has this runner assigned will receive the
                  flag{" "}
                  <Chip
                    color="warning"
                    size="sm"
                    startContent={<InfoIcon height={15} width={15} />}
                    variant="flat"
                  >
                    Maintenace Required
                  </Chip>
                </p>
                <Divider />
                <Snippet hideCopyButton hideSymbol>
                  <span>
                    Name:{" "}
                    {
                      runners.find(
                        (runner: any) => runner.id === runnerToDelete,
                      ).name
                    }
                  </span>
                  <span>ID: {runnerToDelete}</span>
                </Snippet>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="font-bold"
                  color="danger"
                  isLoading={isDeleteLoading}
                  startContent={<DeleteDocumentIcon />}
                  variant="solid"
                  onPress={deleteRunner}
                >
                  DELETE
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
