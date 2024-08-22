"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Card,
  CardHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import { EditIcon, InfoIcon } from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import EditProjectMember from "@/lib/fetch/project/PUT/editProjectMember";

export default function EditProjectMemberModal({
  disclosure,
  projectID,
  user,
}: {
  disclosure: UseDisclosureReturn;
  projectID: string;
  user: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [role, setRole] = React.useState(user.role);

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSelectRole = (e: any) => {
    setRole(e.currentKey);
  };

  useEffect(() => {
    setRole(user.role);
  }, [user]);

  async function handleUpdateUser() {
    setIsLoginLoading(true);

    const response = await EditProjectMember(projectID, role, user.user_id);

    if (response.result === "success") {
      setError(false);
      setErrorText("");
      onOpenChange();
      toast.success("Member edited successfully");
      router.refresh();
    } else if (response.error) {
      setError(true);
      setErrorText(response.error);
      toast.error("Failure: " + response.error);
    }

    setIsLoginLoading(false);
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Edit Member</p>
                  <p className="text-sm text-default-500">
                    Change the role of the member by selecting it below
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <Card className="border border-danger-300 border-2">
                    <CardHeader className="justify-start gap-2 items-center">
                      <IconWrapper className="bg-danger/10 text-danger">
                        <InfoIcon className="text-lg" />
                      </IconWrapper>
                      <p className="text-md font-bold text-danger">
                        {errorText}
                      </p>
                    </CardHeader>
                  </Card>
                )}
                <Select
                  className="w-full"
                  label="Member Role"
                  labelPlacement="outside"
                  placeholder="Select the role of the member"
                  selectedKeys={[role]}
                  variant="flat"
                  onSelectionChange={handleSelectRole}
                >
                  <SelectItem
                    key="Owner"
                    className="text-danger"
                    color="danger"
                  >
                    Owner
                  </SelectItem>
                  <SelectItem
                    key="Editor"
                    className="text-primary"
                    color="primary"
                  >
                    Editor
                  </SelectItem>
                  <SelectItem key="Viewer">Viewer</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter className="grid grid-cols-2">
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoginLoading}
                  variant="flat"
                  onPress={handleUpdateUser}
                >
                  Update Member
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
