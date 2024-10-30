"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import UpdateUser from "@/lib/fetch/admin/PUT/UpdateUser";

export default function EditUserModal({
  user,
  plans,
  disclosure,
}: {
  user: any;
  plans: any;
  disclosure: UseDisclosureReturn;
}) {
  const router = useRouter();

  const { isOpen, onOpenChange, onClose } = disclosure;

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState(new Set([]) as any);
  const [plan, setPlan] = React.useState(new Set([]) as any);

  // loading
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (user !== null) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(new Set([user.role]));
      setPlan(new Set([user.plan]));
    }
  }, [user]);

  async function editUser() {
    setIsLoading(true);

    const response = await UpdateUser(
      user.id,
      username,
      email,
      role.currentKey ? role.currentKey : user.role,
      plan.currentKey ? plan.currentKey : user.plan,
    );

    if (response.result === "success") {
      router.refresh();
      onOpenChange();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("Failed to update user");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Edit User</p>
                  <p className="text-sm text-default-500">
                    Edit the user details below and click apply changes to save.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Username"
                  labelPlacement="outside"
                  placeholder="Enter the username"
                  type="name"
                  value={username}
                  variant="flat"
                  onValueChange={setUsername}
                />
                <Input
                  isRequired
                  label="Email"
                  labelPlacement="outside"
                  placeholder="Enter the email"
                  type="email"
                  value={email}
                  variant="flat"
                  onValueChange={setEmail}
                />
                <Select
                  isRequired
                  label="Role"
                  labelPlacement="outside"
                  placeholder="Select the user role"
                  selectedKeys={role}
                  variant="flat"
                  onSelectionChange={setRole}
                >
                  <SelectItem key="user">User</SelectItem>
                  <SelectItem key="vip">VIP</SelectItem>
                  <SelectItem key="admin">Admin</SelectItem>
                </Select>
                <Select
                  isRequired
                  label="Plan"
                  labelPlacement="outside"
                  placeholder="Select the user plan"
                  selectedKeys={plan}
                  variant="flat"
                  onSelectionChange={setPlan}
                >
                  {plans.map((plan: any) => (
                    <SelectItem key={plan.id}>{plan.name}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={isLoading}
                  variant="flat"
                  onPress={editUser}
                >
                  Apply Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
