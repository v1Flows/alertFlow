/* eslint-disable no-undef */
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
} from "@nextui-org/react";
import { Toaster, toast } from "sonner";

import { CopyDocumentIcon } from "@/components/icons";
import AddAPIKeyModal from "@/components/dashboard/projects/project/modals/AddAPIKey";
import DeleteAPIKeyModal from "@/components/dashboard/projects/project/modals/DeleteAPIKey";

export default function ProjectAPIKeys({ apiKeys, project, settings }: any) {
  const copyAPIKeytoClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard!");
  };

  const renderCell = React.useCallback((key: any, columnKey: any) => {
    const cellValue = key[columnKey];

    switch (columnKey) {
      case "key":
        return <Snippet>{key.key}</Snippet>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Copy API Key">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <CopyDocumentIcon
                  onClick={() => {
                    copyAPIKeytoClipboard(key.key);
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete API Key">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteAPIKeyModal keyID={key.id} />
              </span>
            </Tooltip>
          </div>
        );
      case "created_at":
        return new Date(key.created_at).toLocaleString();
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col items-end justify-center gap-4">
        <AddAPIKeyModal projectID={project.id} settings={settings} />
      </div>
    );
  }, []);

  return (
    <div>
      <Toaster richColors position="bottom-center" />
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
        <TableBody
          emptyContent={"No rows to display."}
          items={apiKeys.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )}
        >
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
