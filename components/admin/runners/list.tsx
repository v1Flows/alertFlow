"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  cn,
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
  Snippet,
  Divider,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import TimeAgo from "react-timeago";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DeleteDocumentIcon,
  EditDocumentIcon,
  EyeIcon,
  InfoIcon,
  LockIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import DeleteProjectRunner from "@/lib/fetch/project/DELETE/DeleteRunner";

export function SelfHostedRunnerList({ runners, projects }: any) {
  const router = useRouter();

  // delete runner
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [runnerToDelete, setRunnerToDelete] = React.useState("");
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

  function handleDeleteRunner(id: any) {
    setRunnerToDelete(id);
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

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

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

  const renderCell = React.useCallback((runner: any, columnKey: any) => {
    const cellValue = runner[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div>
            <p>{runner.name}</p>
            <p className="text-xs text-default-400">{runner.id}</p>
          </div>
        );
      case "project":
        return (
          <div>
            <p>{projects.find((p: any) => p.id === runner.project_id).name}</p>
            <p className="text-xs text-default-400">{runner.project_id}</p>
          </div>
        );
      case "registered":
        return (
          <Chip color={runner.registered ? "success" : "danger"} variant="dot">
            {runner.registered ? "Registered" : "Unregistered"}
          </Chip>
        );
      case "status":
        return (
          <div>
            <Chip
              className="capitalize"
              color={runner.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {runner.disabled ? "Disabled" : "Active"}
            </Chip>
            {runner.disabled && (
              <p className="text-sm text-default-400">
                {runner.disabled_reason}
              </p>
            )}
          </div>
        );
      case "executing_job":
        return (
          <Chip
            color={runner.executing_job ? "primary" : "default"}
            variant="dot"
          >
            {runner.executing_job ? "Active" : "Idle"}
          </Chip>
        );
      case "last_heartbeat":
        return (
          <p className={"text-" + heartbeatColor(runner)}>
            {runner.last_heartbeat !== "0001-01-01T00:00:00Z" && (
              <TimeAgo date={runner.last_heartbeat} />
            )}
            {runner.last_heartbeat === "0001-01-01T00:00:00Z" && "N/A"}
          </p>
        );
      case "functions":
        return (
          <div>
            <p className="text-sm text-default-500">Actions: {runner.available_actions.length}</p>
            <p className="text-sm text-default-500">Payload Injectors: {runner.available_payload_injectors.length}</p>
          </div>
        );
      case "runner_version":
        return <p>{runner.runner_version ? runner.runner_version : "N/A"}</p>;
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownSection showDivider title="Actions">
                  <DropdownItem
                    key="view"
                    className="text-primary"
                    color="primary"
                    description="Take a look on this project"
                    startContent={
                      <EyeIcon className={cn(iconClasses, "text-primary")} />
                    }
                  >
                    View Project
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    description="Apply changes to this project"
                    startContent={
                      <EditDocumentIcon
                        className={cn(iconClasses, "text-warning")}
                      />
                    }
                  >
                    Edit Runner
                  </DropdownItem>
                  <DropdownItem
                    key="disable"
                    className="text-secondary"
                    color="secondary"
                    description="Disable access to this project for members"
                    startContent={
                      <LockIcon className={cn(iconClasses, "text-secondary")} />
                    }
                  >
                    Disable Runner
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    description="Permanently delete this project"
                    startContent={
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-danger")}
                      />
                    }
                    onClick={() => handleDeleteRunner(runner.id)}
                  >
                    Delete Runner
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <main>
      <p className="text-2xl font-bold mb-0 text-secondary mb-2">
        Self-Hosted Runners
      </p>
      <div>
        <Table aria-label="Example table with custom cells">
          <TableHeader>
            <TableColumn key="name" align="start">
              NAME
            </TableColumn>
            <TableColumn key="runner_version" align="start">
              VERSION
            </TableColumn>
            <TableColumn key="project" align="start">
              PROJECT
            </TableColumn>
            <TableColumn key="status" align="start">
              STATUS
            </TableColumn>
            <TableColumn key="registered" align="start">
              REGISTERED
            </TableColumn>
            <TableColumn key="executing_job" align="start">
              EXECUTING JOB
            </TableColumn>
            <TableColumn key="last_heartbeat" align="start">
              LAST HEARTBEAT
            </TableColumn>
            <TableColumn key="functions" align="start">
              FUNCTIONS
            </TableColumn>
            <TableColumn key="actions" align="center">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={runners}>
            {(item: any) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
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
      </div>
    </main>
  );
}
