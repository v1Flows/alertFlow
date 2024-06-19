import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Snippet,
  Button,
} from "@nextui-org/react";

import {
  EditIcon,
  DeleteIcon,
  CopyDocumentIcon,
  PlusIcon,
} from "@/components/icons";

const statusColorMap = {
  Owner: "danger",
  Editor: "primary",
  Viewer: "default",
};

export default function ProjectAPIKeys({ apiKeys }: any) {
  const renderCell = React.useCallback((key, columnKey) => {
    const cellValue = key[columnKey];

    switch (columnKey) {
      case "key":
        return <Snippet>{key.key}</Snippet>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Copy API Key">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <CopyDocumentIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit API Key">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete API Key">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
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
        <Button color="primary" endContent={<PlusIcon />}>
          Add New
        </Button>
      </div>
    );
  });

  return (
    <div>
      <Table
        aria-label="Example table with custom cells"
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn key="id" align="start">
            ID
          </TableColumn>
          <TableColumn key="description" align="start">
            DESCRIPTION
          </TableColumn>
          <TableColumn key="created_at" align="start">
            CREATED AT
          </TableColumn>
          <TableColumn key="actions" align="center">
            ACTIONS
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No rows to display."} items={apiKeys}>
          {(item) => (
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
