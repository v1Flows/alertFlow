/* eslint-disable no-undef */
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  User,
} from "@nextui-org/react";

export default function ProjectAuditLogs({ audit, members }: any) {
  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(audit.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return audit.slice(start, end);
  }, [page, audit]);

  function operationColor(operation: string) {
    switch (operation) {
      case "create":
        return "success";
      case "update":
        return "warning";
      case "delete":
        return "danger";
      default:
        return "default";
    }
  }

  const renderCell = React.useCallback((entry: any, columnKey: any) => {
    const cellValue = entry[columnKey];
    const user = members.find(
      (member: any) => member.user_id === entry.user_id,
    );

    switch (columnKey) {
      case "user_id":
        return (
          <User
            avatarProps={{
              name: user.username,
            }}
            description={user.email}
            name={user.username}
          />
        );
      case "operation":
        return (
          <p
            className={`text-${operationColor(entry.operation)} capitalize font-bold`}
          >
            {entry.operation}
          </p>
        );
      case "created_at":
        return new Date(entry.created_at).toLocaleString();
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <Table
        aria-label="Example table with custom cells"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
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
      >
        <TableHeader>
          <TableColumn key="id" align="start">
            ID
          </TableColumn>
          <TableColumn key="user_id" align="start">
            USER
          </TableColumn>
          <TableColumn key="operation" align="start">
            OPERATION
          </TableColumn>
          <TableColumn key="details" align="start">
            DETAILS
          </TableColumn>
          <TableColumn key="created_at" align="start">
            CREATED AT
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
  );
}
