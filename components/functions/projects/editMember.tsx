"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Card,
  CardHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { EditIcon, InfoIcon } from "@/components/icons";
import { IconWrapper } from "@/lib/IconWrapper";
import EditProjectMember from "@/lib/fetch/project/PUT/editProjectMember";
import { toast } from "sonner";

// import UpdateProjectMembers from "@/lib/fetch/project/PUT/UpdateProjectMembers";

export default function EditProjectMemberModal({ projectID, user }: any) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [role, setRole] = React.useState(user.role);

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSelectRole = (e: any) => {
    setRole(e.currentKey);
  };

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
      <EditIcon onClick={onOpen} />
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 text-warning">
                <EditIcon />
                Edit Member
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
                  placeholder="Select the role of the member"
                  selectedKeys={[role]}
                  variant="bordered"
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
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoginLoading}
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
