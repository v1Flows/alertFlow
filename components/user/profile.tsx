"use client";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import ChangeUserDetails from "@/lib/fetch/user/changeDetails";
import { toast } from "sonner";

export function UserProfile({ user, settings }: any) {
  const router = useRouter();

  const [username, setUsername] = React.useState(user.username);
  const [email, setEmail] = React.useState(user.email);
  const [isLoading, setIsLoading] = React.useState(false);

  async function UpdateUser() {
    setIsLoading(true);
    const res = await ChangeUserDetails(user.id, username, email);

    if (res) {
      setIsLoading(false);
      toast.success("User updated successfully");
      router.refresh();
    } else {
      setIsLoading(false);
      toast.error("Failed to update user");
    }
  }

  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-default-500">👋 Hey</p>
          <p className="text-2xl font-bold mb-0 text-primary">
            {user.username}
          </p>
        </div>
      </div>
      <Divider className="mb-4 mt-4" />
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" color="primary">
          <Tab key="profile" title="Profile">
            <Card>
              <CardBody>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </CardBody>
            </Card>
          </Tab>
          <Tab key="account" title="Account">
            <div className="flex flex-col gap-4">
              <Input
                description="Username must be unique"
                label="Username"
                labelPlacement="outside"
                radius="sm"
                type="username"
                value={username}
                onValueChange={setUsername}
              />

              <Input
                description="Email address must be unique"
                label="Email Address"
                labelPlacement="outside"
                radius="sm"
                type="email"
                value={email}
                onValueChange={setEmail}
              />

              <div className="flex justify-start gap-4">
                <Button
                  color="primary"
                  isLoading={isLoading}
                  radius="sm"
                  variant="flat"
                  onPress={() => UpdateUser()}
                >
                  Update Account
                </Button>
                <Button color="secondary" radius="sm" variant="flat">
                  Change Password
                </Button>
              </div>
            </div>
          </Tab>
          <Tab key="appearance" title="Appearance">
            <Card>
              <CardBody>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </CardBody>
            </Card>
          </Tab>
          <Tab key="billing" title="Billing">
            <Card>
              <CardBody>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}
