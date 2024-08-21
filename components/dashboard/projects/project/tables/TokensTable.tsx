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
  Pagination,
} from "@nextui-org/react";
import { toast } from "sonner";

import { CopyDocumentIcon, DeleteIcon, PlusIcon } from "@/components/icons";
import CreateTokenModal from "@/components/functions/tokens/create";
import DeleteTokenModal from "@/components/functions/tokens/delete";

export default function ProjectTokens({
  tokens,
  project,
  settings,
  members,
  user,
}: any) {
  const [targetToken, setTargetToken] = React.useState({} as any);

  const addTokenModal = useDisclosure();
  const deleteTokenModal = useDisclosure();

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(tokens.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return tokens.slice(start, end);
  }, [page, tokens]);

  const copyTokentoClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard!");
  };

  const renderCell = React.useCallback((key: any, columnKey: any) => {
    const cellValue = key[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Copy Token">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <CopyDocumentIcon
                  onClick={() => {
                    copyTokentoClipboard(key.key);
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Token">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon
                  onClick={() => {
                    if (
                      members.find((m: any) => m.user_id === user.id) &&
                      members.filter((m: any) => m.user_id === user.id)[0]
                        .role !== "Viewer"
                    ) {
                      setTargetToken(key);
                      deleteTokenModal.onOpen();
                    }
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
              <p className="text-sm text-default-400">{key.disabled_reason}</p>
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
          isDisabled={
            !settings.create_api_keys ||
            project.disabled ||
            (members.find((m: any) => m.user_id === user.id) &&
              members.filter((m: any) => m.user_id === user.id)[0].role ===
              "Viewer")
          }
          startContent={<PlusIcon height={undefined} width={undefined} />}
          onPress={() => addTokenModal.onOpen()}
        >
          Add Token
        </Button>
      </div>
    );
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
      <CreateTokenModal disclosure={addTokenModal} projectID={project.id} />
      <DeleteTokenModal disclosure={deleteTokenModal} token={targetToken} />
    </div>
  );
}
