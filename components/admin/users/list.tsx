"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Divider,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  cn,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import {
  EyeIcon,
  VerticalDotsIcon,
  EditDocumentIcon,
  LockIcon,
  DeleteDocumentIcon,
} from "@/components/icons";
import UpdateUserStatus from "@/lib/fetch/admin/PUT/UpdateUserStatus";

export function UsersList({ users }: any) {
  const router = useRouter();

  async function changeUserStatus(userID: string, disabled: boolean) {
    const res = await UpdateUserStatus(userID, disabled);

    router.refresh();

    if (!res.error) {
      toast.success("User status updated successfully");
    } else {
      toast.error("Failed to update user status");
    }
  }

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "username":
        return (
          <User
            avatarProps={{
              radius: "sm",
              name: user.username,
              color: user.role === "Admin" ? "danger" : "primary",
            }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <p
            className={`font-bold text-sm capitalize text-${user.role === "Admin" ? "danger" : "success"}`}
          >
            {cellValue}
          </p>
        );
      case "disabled":
        return (
          <Chip
            className="capitalize"
            color={user.disabled ? "danger" : "success"}
            size="sm"
            variant="flat"
          >
            {user.disabled ? "Disabled" : "Active"}
          </Chip>
        );
      case "created_at":
        return new Date(user.created_at).toLocaleString("de-DE");
      case "updated_at":
        return (
          <p>
            {user.updated_at.Valid
              ? new Date(user.updated_at.Time).toLocaleString("de-DE")
              : "N/A"}
          </p>
        );
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="faded">
                <DropdownSection showDivider title="Actions">
                  <DropdownItem
                    key="view"
                    className="text-primary"
                    color="primary"
                    description="Take a look on this user"
                    startContent={
                      <EyeIcon className={cn(iconClasses, "text-primary")} />
                    }
                  >
                    View User
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger Zone">
                  <DropdownItem
                    key="edit"
                    className="text-warning"
                    color="warning"
                    description="Apply changes to this user"
                    startContent={
                      <EditDocumentIcon
                        className={cn(iconClasses, "text-warning")}
                      />
                    }
                  >
                    Edit User
                  </DropdownItem>
                  {!user.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-secondary"
                      color="secondary"
                      description="Disable access to AlertFlow for this user"
                      startContent={
                        <LockIcon
                          className={cn(iconClasses, "text-secondary")}
                        />
                      }
                      onClick={() => changeUserStatus(user.id, true)}
                    >
                      Disable User
                    </DropdownItem>
                  )}
                  {user.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-success"
                      color="success"
                      description="Enable access to AlertFlow for this user"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-success")} />
                      }
                      onClick={() => changeUserStatus(user.id, false)}
                    >
                      Enable User
                    </DropdownItem>
                  )}
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    description="Permanently delete this user"
                    startContent={
                      <DeleteDocumentIcon
                        className={cn(iconClasses, "text-danger")}
                      />
                    }
                  >
                    Delete User
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
      <Toaster richColors position="bottom-center" />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">Users</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <Table aria-label="Example table with custom cells">
          <TableHeader>
            <TableColumn key="username" align="start">
              USERNAME
            </TableColumn>
            <TableColumn key="id" align="start">
              ID
            </TableColumn>
            <TableColumn key="role" align="start">
              ROLE
            </TableColumn>
            <TableColumn key="disabled" align="start">
              STATUS
            </TableColumn>
            <TableColumn key="created_at" align="start">
              CREATED AT
            </TableColumn>
            <TableColumn key="updated_at" align="start">
              UPDATED AT
            </TableColumn>
            <TableColumn key="actions" align="center">
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody items={users}>
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
    </main>
  );
}
