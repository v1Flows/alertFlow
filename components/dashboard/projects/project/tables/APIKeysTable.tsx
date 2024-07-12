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
  Chip,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "sonner";

import { CopyDocumentIcon, DeleteIcon, PlusIcon } from "@/components/icons";
import CreateApiKeyModal from "@/components/functions/apikeys/create";
import DeleteApiKeyModal from "@/components/functions/apikeys/delete";

export default function ProjectAPIKeys({ apiKeys, project, settings }: any) {
  const [targetKey, setTargetKey] = React.useState({} as any);

  const addApiKeyModal = useDisclosure();
  const deleteApiKeyModal = useDisclosure();

  const copyAPIKeytoClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard!");
  };

  const renderCell = React.useCallback((key: any, columnKey: any) => {
    const cellValue = key[columnKey];

    switch (columnKey) {
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
                <DeleteIcon
                  onClick={() => {
                    setTargetKey(key);
                    deleteApiKeyModal.onOpen();
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      case "created_at":
        return new Date(key.created_at).toLocaleString();
      case "status":
        return (
          <div>
            <Chip
              className="capitalize"
              color={key.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {key.disabled ? "Disabled" : "Active"}
            </Chip>
            {key.disabled && (
              <p className="text-sm text-default-400">
                {key.disabled_reason}
              </p>
            )}
          </div>
        );
      case "type":
        return <p className="capitalize">{key.type}</p>;
      default:
        return cellValue;
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col items-end justify-center gap-4">
        <Button
          color="primary"
          endContent={<PlusIcon height={undefined} width={undefined} />}
          isDisabled={!settings.create_api_keys || project.disabled}
          onPress={() => addApiKeyModal.onOpen()}
        >
          Add New
        </Button>
      </div>
    );
  }, []);

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
          <TableColumn key="status" align="start">
            STATUS
          </TableColumn>
          <TableColumn key="type" align="start">
            TYPE
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
      <CreateApiKeyModal disclosure={addApiKeyModal} projectID={project.id} />
      <DeleteApiKeyModal apikey={targetKey} disclosure={deleteApiKeyModal} />
    </div>
  );
}
