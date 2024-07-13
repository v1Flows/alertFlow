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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  useDisclosure,
  Pagination,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  EyeIcon,
  VerticalDotsIcon,
  EditDocumentIcon,
  LockIcon,
  DeleteDocumentIcon,
} from "@/components/icons";
import UpdateUserStatus from "@/lib/fetch/admin/PUT/UpdateUserState";

export function UsersList({ users }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disableReason, setDisableReason] = React.useState("");
  const [isDisableLoading, setIsDisableLoading] = React.useState(false);

  const [userID, setUserID] = React.useState("");
  const [disableUser, setDisableUser] = React.useState(false);

  React.useEffect(() => {
    if (userID !== "" && !disableUser) {
      changeUserStatus();
    }
  }, [userID, disableUser]);

  function changeUserStatusModal(userID: string, disabled: boolean) {
    setUserID(userID);
    setDisableUser(disabled);

    if (disabled) {
      onOpenChange();
    }
  }

  async function changeUserStatus() {
    if (!disableUser) {
      const res = await UpdateUserStatus(userID, disableUser, "");

      if (!res.error) {
        setUserID("");
        router.refresh();
        toast.success("User status updated successfully");
      } else {
        router.refresh();
        toast.error("Failed to update user status");
      }
    } else {
      setIsDisableLoading(true);
      const res = await UpdateUserStatus(userID, disableUser, disableReason);

      if (!res.error) {
        setIsDisableLoading(false);
        setDisableReason("");
        setUserID("");
        setDisableUser(false);
        onOpenChange();
        router.refresh();
        toast.success("User status updated successfully");
      } else {
        setIsDisableLoading(false);
        router.refresh();
        toast.error("Failed to update user status");
      }
    }
  }

  // pagination
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 7;
  const pages = Math.ceil(users.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

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
          <div>
            <Chip
              className="capitalize"
              color={user.disabled ? "danger" : "success"}
              radius="sm"
              size="sm"
              variant="flat"
            >
              {user.disabled ? "Disabled" : "Active"}
            </Chip>
            {user.disabled && (
              <p className="text-sm text-default-400">{user.disabled_reason}</p>
            )}
          </div>
        );
      case "created_at":
        return new Date(user.created_at).toLocaleString("de-DE");
      case "updated_at":
        return (
          <p>
            {user.updated_at
              ? new Date(user.updated_at).toLocaleString("de-DE")
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
                    View
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Edit Zone">
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
                    Edit
                  </DropdownItem>
                  {!user.disabled && (
                    <DropdownItem
                      key="disable"
                      className="text-danger"
                      color="danger"
                      description="Disable access to AlertFlow for this user"
                      startContent={
                        <LockIcon className={cn(iconClasses, "text-danger")} />
                      }
                      onClick={() => changeUserStatusModal(user.id, true)}
                    >
                      Disable
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
                      onClick={() => changeUserStatusModal(user.id, false)}
                    >
                      Enable
                    </DropdownItem>
                  )}
                </DropdownSection>
                <DropdownSection title="Danger Zone">
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
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">Users</p>
        </div>
      </div>
      <Divider className="my-4" />
      <div>
        <Table
          aria-label="Example table with custom cells"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
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
          <TableBody items={items}>
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
      <div>
        <Modal
          isOpen={isOpen}
          placement="top-center"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-danger">
                  <LockIcon /> Disable User
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Disable Reason"
                    placeholder="Enter the reason for disabling this user"
                    value={disableReason}
                    variant="bordered"
                    onValueChange={setDisableReason}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    isLoading={isDisableLoading}
                    onPress={changeUserStatus}
                  >
                    Disable
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
}
