import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Chip,
  Pagination,
  useDisclosure,
  Button,
} from "@nextui-org/react";

import AddProjectMemberModal from "@/components/functions/projects/members";
import { PlusIcon } from "@/components/icons";
import EditProjectMemberModal from "@/components/functions/projects/editMember";

import DeleteMemberModal from "../../../../functions/projects/removeMember";

const statusColorMap: any = {
  Owner: "danger",
  Editor: "primary",
  Viewer: "default",
};

export default function ProjectMembers({
  project,
  members,
  settings,
  plan,
}: any) {
  const addProjectMemberModal = useDisclosure();

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(members.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return members.slice(start, end);
  }, [page, members]);

  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", name: user.username }}
            description={user.email}
            name={user.username}
          >
            {user.user_id}
          </User>
        );
      case "role":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.role]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "invite_pending":
        return (
          <Chip
            className="capitalize"
            color={user.invite_pending ? "warning" : "success"}
            size="sm"
            variant="flat"
          >
            {user.invite_pending ? "Pending" : "Accepted"}
          </Chip>
        );
      case "invited_at":
        return new Date(user.invited_at).toLocaleString();
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Edit User">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditProjectMemberModal projectID={project.id} user={user} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Remove User">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteMemberModal projectID={project.id} user={user} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col items-end justify-center gap-4">
        <Button
          color="primary"
          isDisabled={
            settings.add_project_members ||
            members.length >= plan.project_members
          }
          startContent={<PlusIcon />}
          onPress={() => addProjectMemberModal.onOpen()}
        >
          Add Member
        </Button>
      </div>
    );
  }, []);

  return (
    <>
      <Table
        aria-label="Example table with custom cells"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn key="name" align="start">
            NAME
          </TableColumn>
          <TableColumn key="role" align="start">
            ROLE
          </TableColumn>
          <TableColumn key="invite_pending" align="start">
            Status
          </TableColumn>
          <TableColumn key="invited_at" align="start">
            Invited At
          </TableColumn>
          <TableColumn key="actions" align="center">
            ACTIONS
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No rows to display."} items={items}>
          {(item: any) => (
            <TableRow key={item.user_id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddProjectMemberModal
        disclosure={addProjectMemberModal}
        members={members}
        project={project}
      />
    </>
  );
}
