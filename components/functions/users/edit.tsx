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
import { Icon } from "@iconify/react";
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
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 font-bold text-warning">
                <Icon icon="solar:smile-square-broken" width={24} /> Edit User
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Username"
                  placeholder="Enter the username"
                  type="name"
                  value={username}
                  variant="bordered"
                  onValueChange={setUsername}
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter the email"
                  type="email"
                  value={email}
                  variant="bordered"
                  onValueChange={setEmail}
                />
                <Select
                  isRequired
                  label="Role"
                  placeholder="Select the user role"
                  selectedKeys={role}
                  variant="bordered"
                  onSelectionChange={setRole}
                >
                  <SelectItem key="User">User</SelectItem>
                  <SelectItem key="VIP">VIP</SelectItem>
                  <SelectItem key="Admin">Admin</SelectItem>
                </Select>
                <Select
                  isRequired
                  label="Plan"
                  placeholder="Select the user plan"
                  selectedKeys={plan}
                  variant="bordered"
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
                  Update User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
