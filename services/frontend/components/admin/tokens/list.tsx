"use client";
import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Pagination,
  Snippet,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import React, { useCallback, useMemo, useState } from "react";

import { PlusIcon } from "@/components/icons";
import CreateServiceTokenModal from "@/components/functions/admin/createToken";
import AdminDeleteTokenModal from "@/components/functions/admin/deleteToken";
import AdminEditTokenModal from "@/components/functions/admin/edit";

export function TokensList({ tokens, projects }: any) {
  const [targetToken, setTargetToken] = useState({} as any);
  const addTokenModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteTokenModal = useDisclosure();

  // pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;
  const pages = Math.ceil(tokens.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return tokens.slice(start, end);
  }, [page, tokens]);

  const renderCell = useCallback((token: any, columnKey: any) => {
    const cellValue = token[columnKey];

    switch (columnKey) {
      case "project_id":
        return (
          <div>
            {token.project_id !== "none" && (
              <span>
                <p className="font-semibold">
                  {projects.find((p: any) => p.id === token.project_id)?.name ||
                    "Unknown"}
                </p>
                <p className="text-sm text-default-400">{token.project_id}</p>
              </span>
            )}
            {token.project_id === "none" && (
              <span>
                <p className="font-semibold">None</p>
                <p className="text-sm text-default-400">
                  Probaply an Token for anything Alertflow related
                </p>
              </span>
            )}
          </div>
        );
      case "description":
        return <p className="text-sm">{token.description}</p>;
      case "type":
        return <p className="text-sm">{token.type}</p>;
      case "status":
        return (
          <div>
            <Chip
              className="capitalize"
              color={token.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {token.disabled ? "Disabled" : "Active"}
            </Chip>
            {token.disabled && (
              <p className="text-sm text-default-400">
                {token.disabled_reason}
              </p>
            )}
          </div>
        );
      case "expires_at":
        return new Date(token.expires_at).toLocaleString("de-DE");
      case "created_at":
        return new Date(token.created_at).toLocaleString("de-DE");
      case "key":
        return (
          <Snippet hideSymbol className="w-full" codeString={token.key}>
            <span>{`${token.key.slice(0, 15)}...`}</span>
          </Snippet>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon
                    className="text-default-400"
                    icon="solar:menu-dots-linear"
                    width={24}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownSection title="Edit Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    startContent={
                      <Icon icon="hugeicons:pencil-edit-02" width={20} />
                    }
                    onPress={() => {
                      setTargetToken(token);
                      editModal.onOpen();
                    }}
                  >
                    Edit
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger Zone">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={
                      <Icon icon="hugeicons:delete-02" width={20} />
                    }
                    onPress={() => {
                      setTargetToken(token);
                      deleteTokenModal.onOpen();
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
          <p className="mb-0 text-2xl font-bold text-danger">Admin</p>
          <p className="mb-0 text-2xl">|</p>
          <p className="mb-0 text-2xl">Tokens</p>
        </div>
        <Button
          color="primary"
          radius="lg"
          startContent={<PlusIcon height={undefined} width={undefined} />}
          variant="solid"
          onPress={() => addTokenModal.onOpen()}
        >
          Generate Service Token
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
            <TableColumn key="id" align="start">
              ID
            </TableColumn>
            <TableColumn key="project_id" align="start">
              Project
            </TableColumn>
            <TableColumn key="description" align="start">
              Description
            </TableColumn>
            <TableColumn key="type" align="start">
              Type
            </TableColumn>
            <TableColumn key="key" align="start">
              Key
            </TableColumn>
            <TableColumn key="status" align="start">
              Status
            </TableColumn>
            <TableColumn key="created_at" align="start">
              Created At
            </TableColumn>
            <TableColumn key="expires_at" align="start">
              Expires At
            </TableColumn>
            <TableColumn key="actions" align="center">
              Actions
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
      </div>
      <CreateServiceTokenModal disclosure={addTokenModal} />
      <AdminEditTokenModal disclosure={editModal} token={targetToken} />
      <AdminDeleteTokenModal
        disclosure={deleteTokenModal}
        token={targetToken}
      />
    </main>
  );
}
