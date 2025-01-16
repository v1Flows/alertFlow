import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import React from "react";
import { toast } from "sonner";

import { PlusIcon } from "@/components/icons";
import DeleteTokenModal from "@/components/functions/tokens/delete";
import CreateTokenModal from "@/components/functions/tokens/create";

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

  function checkAddTokenDisabled() {
    if (!settings.create_api_keys) {
      return true;
    } else if (project.disabled) {
      return true;
    } else if (user.role === "vip") {
      return false;
    } else if (user.role === "admin") {
      return false;
    } else if (
      members.find((m: any) => m.user_id === user.id) &&
      members.filter((m: any) => m.user_id === user.id)[0].role === "Viewer"
    ) {
      return true;
    }

    return false;
  }

  const renderCell = React.useCallback((key: any, columnKey: any) => {
    const cellValue = key[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Copy Token">
              <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                <Icon
                  icon="solar:copy-outline"
                  width={20}
                  onClick={() => {
                    copyTokentoClipboard(key.key);
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Token">
              <span className="cursor-pointer text-lg text-danger active:opacity-50">
                <Icon
                  icon="solar:trash-bin-trash-outline"
                  width={20}
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
          isDisabled={checkAddTokenDisabled()}
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
        <TableBody emptyContent="No rows to display." items={items}>
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
