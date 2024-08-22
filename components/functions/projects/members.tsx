"use client";

import type { Selection } from "@nextui-org/react";
import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  CardFooter,
  Spacer,
  Divider,
  AvatarGroup,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import AddProjectMember from "@/lib/fetch/project/POST/AddProjectMember";

import UserCell from "./user-cell";

export default function AddProjectMemberModal({
  disclosure,
  project,
  members,
}: {
  disclosure: UseDisclosureReturn;
  project: any;
  members: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  const [email, setEmail] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["Viewer"]),
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const statusColorMap: any = {
    Owner: "danger",
    Editor: "primary",
    Viewer: "default",
  };

  const permissionLabels: Record<string, string> = {
    Owner: "Owner",
    Viewer: "Can View",
    Editor: "Can Edit",
  };

  // Memoize the user list to avoid re-rendering when changing the selected keys
  const userList = React.useMemo(
    () => (
      <div className="mt-2 flex flex-col gap-2">
        {members.map((member: any) => (
          <>
            <UserCell
              key={member.user_id}
              avatar={member.username}
              color={statusColorMap[member.role]}
              name={member.username}
              permission={permissionLabels[member.role]}
            />
            <Divider />
          </>
        ))}
      </div>
    ),
    [],
  );

  async function inviteMember() {
    const role = Array.from(selectedKeys)[0];

    setIsLoading(true);

    const res = await AddProjectMember(project.id, email, role.toString());

    if (res.error) {
      setIsLoading(false);
      toast.error(res.error);
    } else {
      setIsLoading(false);
      setEmail("");
      onOpenChange();
      router.refresh();
      toast.success("Member invited successfully");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      size="lg"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <ModalBody>
            <Card className="w-full bg-transparent shadow-none">
              <CardHeader className="justify-center px-6 pb-0 pt-6">
                <div className="flex flex-col items-center">
                  <AvatarGroup isBordered size="sm">
                    {members.map((member: any) => (
                      <Avatar
                        key={member.id}
                        color={statusColorMap[member.role]}
                        name={member.username}
                      />
                    ))}
                  </AvatarGroup>
                  <Spacer y={2} />
                  <h4 className="text-large">Invite Member</h4>
                  <p className="text-center text-small text-default-500">
                    Invite a new member to your project.
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-2">
                  <Input
                    description="User must have an account"
                    endContent={
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            className="text-default-500"
                            endContent={
                              <span className="hidden sm:flex">
                                <Icon icon="solar:alt-arrow-down-linear" />
                              </span>
                            }
                            size="sm"
                            variant="light"
                          >
                            {Array.from(selectedKeys)
                              .map((key) => permissionLabels[key])
                              .join(", ")}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          selectedKeys={selectedKeys}
                          selectionMode="single"
                          onSelectionChange={setSelectedKeys}
                        >
                          <DropdownItem key="Viewer">Can View</DropdownItem>
                          <DropdownItem key="Editor">Can Edit</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    }
                    label="Email Address"
                    labelPlacement="outside"
                    placeholder="Enter email address"
                    value={email}
                    onValueChange={setEmail}
                  />
                  <Button
                    color="primary"
                    isLoading={isLoading}
                    size="md"
                    onPress={inviteMember}
                  >
                    Invite
                  </Button>
                </div>
                <Spacer y={4} />
                {userList}
              </CardBody>
              <CardFooter className="justify-end gap-2">
                <Button isDisabled size="sm" variant="flat">
                  Copy Link
                </Button>
              </CardFooter>
            </Card>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
