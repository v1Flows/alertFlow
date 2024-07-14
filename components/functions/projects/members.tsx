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

import UserCell from "./user-cell";

export default function AddProjectMemberModal({
  disclosure,
  project,
}: {
  disclosure: UseDisclosureReturn;
  project: any;
}) {
  const { isOpen, onOpen, onOpenChange } = disclosure;

  const [email, setEmail] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["Viewer"]),
  );

  const permissionLabels: Record<string, string> = {
    Owner: "Owner",
    Viewer: "Can View",
    Editor: "Can Edit",
  };

  // Memoize the user list to avoid re-rendering when changing the selected keys
  const userList = React.useMemo(
    () => (
      <div className="mt-2 flex flex-col gap-2">
        {project.members.map((member: any) => (
          <>
            <UserCell
              key={member.id}
              avatar={member.email}
              name={member.email}
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
    console.log(email)
    console.log(selectedKeys)
  }

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <ModalBody>
            <Card className="w-full max-w-[400px] bg-transparent shadow-none">
              <CardHeader className="justify-center px-6 pb-0 pt-6">
                <div className="flex flex-col items-center">
                  <AvatarGroup isBordered size="sm">
                    {project.members.map((member: any) => (
                      <Avatar key={member.id} name={member.email} />
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
                <div className="flex items-end gap-2">
                  <Input
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
                    placeholder="User must have an account"
                    value={email}
                    onValueChange={setEmail}
                  />
                  <Button color="primary" size="md" onPress={inviteMember}>
                    Invite
                  </Button>
                </div>
                <Spacer y={4} />
                {userList}
              </CardBody>
              <CardFooter className="justify-end gap-2">
                <Button size="sm" variant="flat">
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
