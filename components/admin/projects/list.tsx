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
  useDisclosure,
  Pagination,
  Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { PlusIcon } from "@/components/icons";
import ChangeProjectStatusModal from "@/components/functions/projects/changeStatus";
import EditProjectModal from "@/components/functions/projects/edit";
import DeleteProjectModal from "@/components/functions/projects/delete";
import CreateProjectModal from "@/components/functions/projects/create";

export function ProjectList({ projects, members }: any) {
  const router = useRouter();

  const [status, setStatus] = React.useState(false);
  const [targetProject, setTargetProject] = React.useState({});
  const newProjectModal = useDisclosure();
  const changeStatusModal = useDisclosure();
  const editProjectModal = useDisclosure();
  const deleteProjectModal = useDisclosure();

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(projects.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return projects.slice(start, end);
  }, [page, projects]);

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
          <AvatarGroup isBordered max={5} radius="sm">
            {members
              .filter((member: any) => member.project_id === project.id)
              .map((member: any) => (
                <Tooltip
                  key={member.email}
                  content={
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">{member.email}</div>
                      <div className="text-tiny">{member.role}</div>
                    </div>
                  }
                >
                  <Avatar
                    color={
                      member.role === "Owner"
                        ? "danger"
                        : member.role === "Editor"
                          ? "primary"
                          : "default"
                    }
                    name={member.email}
                  />
                </Tooltip>
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
                  <Icon
                    className="text-default-400"
                    icon="solar:menu-dots-broken"
                    width={24}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownSection showDivider title="Actions">
                  <DropdownItem
                    key="view"
                    color="primary"
                    startContent={<Icon icon="solar:eye-broken" width={20} />}
                    onPress={() =>
                      router.push(`/dashboard/projects/${project.id}`)
                    }
                  >
                    View
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Edit Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    startContent={
                      <Icon icon="solar:pen-new-square-broken" width={20} />
                    }
                    onPress={() => {
                      setTargetProject(project);
                      editProjectModal.onOpen();
                    }}
                  >
                    Edit
                  </DropdownItem>
                  {project.disabled && (
                    <DropdownItem
                      key="enable"
                      className="text-success"
                      color="success"
                      startContent={
                        <Icon
                          icon="solar:lock-keyhole-minimalistic-unlocked-broken"
                          width={20}
                        />
                      }
                      onPress={() => {
                        setTargetProject(project);
                        setStatus(false);
                        changeStatusModal.onOpen();
                      }}
                    >
                      Enable
                    </DropdownItem>
                  )}
                  {!project.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-danger"
                      color="danger"
                      startContent={
                        <Icon
                          icon="solar:lock-keyhole-minimalistic-broken"
                          width={20}
                        />
                      }
                      onPress={() => {
                        setTargetProject(project);
                        setStatus(true);
                        changeStatusModal.onOpen();
                      }}
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
                    startContent={
                      <Icon icon="solar:trash-bin-2-broken" width={20} />
                    }
                    onPress={() => {
                      setTargetProject(project);
                      deleteProjectModal.onOpen();
                    }}
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
          <p className="text-2xl mb-0">Projects</p>
        </div>
        <Button
          color="primary"
          radius="lg"
          startContent={<PlusIcon />}
          variant="solid"
          onPress={() => newProjectModal.onOpen()}
        >
          New Project
        </Button>
      </div>
      <Divider className="my-4" />
      <div>
        <Table
          aria-label="Example table with custom cells"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                showControls
                showShadow
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
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
          <TableBody emptyContent={"No rows to display."} items={items}>
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
      <CreateProjectModal disclosure={newProjectModal} />
      <ChangeProjectStatusModal
        disclosure={changeStatusModal}
        project={targetProject}
        status={status}
      />
      <EditProjectModal disclosure={editProjectModal} project={targetProject} />
      <DeleteProjectModal
        disclosure={deleteProjectModal}
        project={targetProject}
      />
    </main>
  );
}
