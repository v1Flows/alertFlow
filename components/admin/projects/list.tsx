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
  AvatarGroup,
  Avatar,
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

export function ProjectList({ projects }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disableReason, setDisableReason] = React.useState("");
  const [isDisableLoading, setIsDisableLoading] = React.useState(false);

  const [projectID, setProjectID] = React.useState("");
  const [disableProject, setDisableProject] = React.useState(false);

  function changeProjectStatusModal(projectID: string, disabled: boolean) {
    setProjectID(projectID);
    setDisableProject(disabled);

    if (disabled) {
      onOpenChange();
    } else {
      changeProjectStatus();
    }
  }

  async function changeProjectStatus() {
    if (!disableProject) {
      const res = await ChangeProjectStatus(projectID, disableProject, "none");

      if (!res.error) {
        setDisableReason("");
        setProjectID("");
        setDisableProject(false);
        toast.success("User status updated successfully");
      } else {
        toast.error("Failed to update user status");
      }
    } else {
      setIsDisableLoading(true);
      const res = await ChangeProjectStatus(
        projectID,
        disableProject,
        disableReason,
      );

      if (!res.error) {
        setIsDisableLoading(false);
        setDisableReason("");
        setProjectID("");
        setDisableProject(false);
        onOpenChange();
        toast.success("User status updated successfully");
      } else {
        setIsDisableLoading(false);
        toast.error("Failed to update user status");
      }
    }
  }

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const renderCell = React.useCallback((project: any, columnKey: any) => {
    const cellValue = project[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div>
            <p>{project.name}</p>
            <p className="text-sm text-default-500">{project.description}</p>
          </div>
        );
      case "id":
        return (
          <Snippet hideSymbol size="sm" variant="flat">
            {project.id}
          </Snippet>
        );
      case "members":
        return (
          <AvatarGroup isBordered max={5} radius="md">
            {project.members.map((member: any) => (
              <Avatar
                key={member.email}
                color={
                  member.role === "Owner"
                    ? "danger"
                    : member.role === "Editor"
                      ? "primary"
                      : "secondary"
                }
                name={member.email}
              />
            ))}
          </AvatarGroup>
        );
      case "alertflow_runners":
        return (
          <Chip
            className="capitalize"
            color={project.alertflow_runners ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {project.alertflow_runners ? "Enabled" : "Disabled"}
          </Chip>
        );
      case "status":
        return (
          <div>
            <Chip
              className="capitalize"
              color={project.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {project.disabled ? "Disabled" : "Active"}
            </Chip>
            {project.disabled && (
              <p className="text-sm text-default-400">
                {project.disabled_reason}
              </p>
            )}
          </div>
        );
      case "created_at":
        return new Date(project.created_at).toLocaleString("de-DE");
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
                    Edit Project
                  </DropdownItem>
                  {project.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-secondary"
                      color="secondary"
                      description="Disable access to this project for members"
                      startContent={
                        <LockIcon
                          className={cn(iconClasses, "text-secondary")}
                        />
                      }
                      onClick={() =>
                        changeProjectStatusModal(project.id, false)
                      }
                    >
                      Enable Project
                    </DropdownItem>
                  )}
                  {!project.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-secondary"
                      color="secondary"
                      description="Disable access to this project for members"
                      startContent={
                        <LockIcon
                          className={cn(iconClasses, "text-secondary")}
                        />
                      }
                      onClick={() => changeProjectStatusModal(project.id, true)}
                    >
                      Disable Project
                    </DropdownItem>
                  )}
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
                  >
                    Delete Project
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
          <p className="text-2xl mb-0">Projects</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <Table aria-label="Example table with custom cells">
          <TableHeader>
            <TableColumn key="name" align="start">
              NAME
            </TableColumn>
            <TableColumn key="id" align="start">
              ID
            </TableColumn>
            <TableColumn key="members" align="start">
              MEMBERS
            </TableColumn>
            <TableColumn key="status" align="start">
              STATUS
            </TableColumn>
            <TableColumn key="alertflow_runners" align="start">
              ALERTFLOW RUNNERS
            </TableColumn>
            <TableColumn key="created_at" align="start">
              CREATED AT
            </TableColumn>
            <TableColumn key="actions" align="center">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No rows to display."} items={projects}>
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
