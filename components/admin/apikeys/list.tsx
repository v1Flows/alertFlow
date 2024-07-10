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
  Divider,
  Snippet,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DeleteDocumentIcon,
  EditDocumentIcon,
  EyeIcon,
  LockIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import ChangeProjectStatus from "@/lib/fetch/project/PUT/ChangeProjectStatus";
import DeleteAPIKeyModal from "@/components/dashboard/projects/project/modals/DeleteAPIKey";

export function ApiKeysList({ apikeys, projects }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disableReason, setDisableReason] = React.useState("");
  const [isDisableLoading, setIsDisableLoading] = React.useState(false);

  const [projectID, setProjectID] = React.useState("");
  const [disableProject, setDisableProject] = React.useState(false);

  React.useEffect(() => {
    if (projectID !== "" && !disableProject) {
      changeProjectStatus();
    }
  }, [projectID, disableProject]);

  function changeProjectStatusModal(projectID: string, disabled: boolean) {
    setProjectID(projectID);
    setDisableProject(disabled);

    if (disabled) {
      onOpenChange();
    }
  }

  async function changeProjectStatus() {
    if (!disableProject) {
      const res = await ChangeProjectStatus(projectID, disableProject, "");

      if (!res.error) {
        setProjectID("");
        router.refresh();
        toast.success("Project status updated successfully");
      } else {
        router.refresh();
        toast.error("Failed to update project status");
      }
    } else {
      setIsDisableLoading(true);
      const res = await ChangeProjectStatus(
        projectID,
        disableProject,
        disableReason,
      );

      if (!res.error) {
        setDisableReason("");
        setProjectID("");
        setDisableProject(false);
        setIsDisableLoading(false);
        onOpenChange();
        router.refresh();
        toast.success("Project status updated successfully");
      } else {
        setIsDisableLoading(false);
        router.refresh();
        toast.error("Failed to update project status");
      }
    }
  }

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const renderCell = React.useCallback((apikey: any, columnKey: any) => {
    const cellValue = apikey[columnKey];

    switch (columnKey) {
      case "project_id":
        return (
          <div>
            {apikey.project_id !== "none" && (
              <span>
                <p>
                  {projects.find((p: any) => p.id === apikey.project_id)?.name}
                </p>
                <p className="text-sm text-default-400">{apikey.project_id}</p>
              </span>
            )}
            {apikey.project_id === "none" && (
              <span>
                <p>None</p>
                <p className="text-sm text-default-400">
                  Probaply an API Key for anything Alertflow related
                </p>
              </span>
            )}
          </div>
        );
      case "description":
        return <p className="text-sm text-default-500">{apikey.description}</p>;
      case "status":
        return (
          <div>
            <Chip
              className="capitalize"
              color={apikey.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {apikey.disabled ? "Disabled" : "Active"}
            </Chip>
            {apikey.disabled && (
              <p className="text-sm text-default-400">
                {apikey.disabled_reason}
              </p>
            )}
          </div>
        );
      case "created_at":
        return new Date(apikey.created_at).toLocaleString("de-DE");
      case "key":
        return (
          <Snippet hideSymbol className="w-full" codeString={apikey.key}>
            <span>{apikey.key.slice(0, 15) + "..."}</span>
          </Snippet>
        );
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
                <DropdownSection title="Edit Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    description="Apply changes to this api key"
                    startContent={
                      <EditDocumentIcon
                        className={cn(iconClasses, "text-warning")}
                      />
                    }
                  >
                    Edit
                  </DropdownItem>
                  {apikey.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-success"
                      color="success"
                      description="Enable this api key"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-success")} />
                      }
                      onClick={() => changeProjectStatusModal(apikey.id, false)}
                    >
                      Enable
                    </DropdownItem>
                  )}
                  {!apikey.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-danger"
                      color="danger"
                      description="Disable this api key"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-danger")} />
                      }
                      onClick={() => changeProjectStatusModal(apikey.id, true)}
                    >
                      Disable
                    </DropdownItem>
                  )}
                </DropdownSection>
                <DropdownSection title="Danger Zone">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    description="Permanently delete this api key"
                    startContent={
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-danger")}
                      />
                    }
                  >
                    Delete
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">API Keys</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <Table aria-label="Example table with custom cells">
          <TableHeader>
            <TableColumn key="id" align="start">
              ID
            </TableColumn>
            <TableColumn key="project_id" align="start">
              PROJECT
            </TableColumn>
            <TableColumn key="description" align="start">
              DESCRIPTION
            </TableColumn>
            <TableColumn key="key" align="start">
              KEY
            </TableColumn>
            <TableColumn key="status" align="start">
              STATUS
            </TableColumn>
            <TableColumn key="created_at" align="start">
              CREATED AT
            </TableColumn>
            <TableColumn key="actions" align="center">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={apikeys}>
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
          isOpen={isOpen}
          placement="top-center"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-danger">
                  <LockIcon /> Disable Project
                </ModalHeader>
                <ModalBody>
                  <Snippet hideCopyButton hideSymbol>
                    <span>ID: {projectID}</span>
                  </Snippet>
                  <Input
                    label="Disable Reason"
                    placeholder="Enter the reason for disabling this project"
                    value={disableReason}
                    variant="bordered"
                    onValueChange={setDisableReason}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    isLoading={isDisableLoading}
                    onPress={changeProjectStatus}
                  >
                    Disable
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
