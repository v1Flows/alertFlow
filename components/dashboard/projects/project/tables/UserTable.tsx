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
} from "@nextui-org/react";

import AddMemberModal from "@/components/dashboard/projects/project/modals/AddMember";

import EditProjectMemberModal from "../modals/EditMember";
import DeleteMemberModal from "../modals/DeleteMember";

const statusColorMap: any = {
  Owner: "danger",
  Editor: "primary",
  Viewer: "default",
};

export default function ProjectMembers({ project, settings }: any) {
  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", name: user.email }}
            name={user.email}
          >
            {user.email}
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
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditProjectMemberModal
                  mailInc={user.email}
                  projectID={project.id}
                  roleInc={user.role}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteMemberModal
                  mailInc={user.email}
                  projectID={project.id}
                  roleInc={user.role}
                />
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
        <AddMemberModal project={project} settings={settings} />
      </div>
    );
  }, []);

  return (
    <Table aria-label="Example table with custom cells" topContent={topContent}>
      <TableHeader>
        <TableColumn key="name" align="start">
          NAME
        </TableColumn>
        <TableColumn key="role" align="start">
          ROLE
        </TableColumn>
        <TableColumn key="actions" align="center">
          ACTIONS
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."} items={project.members}>
        {(item: any) => (
          <TableRow key={item.email}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
