"use client";
import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import ChangeUserDetails from "@/lib/fetch/user/changeDetails";
import CheckUserTaken from "@/lib/auth/checkTaken";

import SecuritySettings from "./security-settings";
import BillingSettings from "./billing-settings";
import Quota from "./quota";

export function UserProfile({
  user,
  paymentMethods,
  plans,
  subscription,
  stats,
}: any) {
  const [selected, setSelected] = React.useState("account");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [username, setUsername] = React.useState(user.username);
  const [email, setEmail] = React.useState(user.email);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const tab = params.get("tab") || "account";

    setSelected(tab);
  }, [params]);

  const handleTabChange = (key: any) => {
    params.set("tab", key);
    router.push(`${pathname}?${params.toString()}`);
  };

  async function checkUserTaken() {
    const res = await CheckUserTaken(email, username);

    if (res.result === "success") {
      UpdateUser();
    } else {
      toast.error(res.error);
    }
  }

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
          <p className="text-2xl font-bold mb-0 text-default-500">
            👋 Welcome on your profile
          </p>
          <p className="text-2xl font-bold mb-0 text-primary">
            {user.username}
          </p>
        </div>
      </div>
      <Divider className="mb-4 mt-4" />
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          color="primary"
          selectedKey={selected}
          onSelectionChange={handleTabChange}
        >
          <Tab
            key="account"
            title={
              <div className="flex items-center gap-1.5">
                <Icon icon="solar:emoji-funny-square-broken" width={20} />
                <p>Account</p>
              </div>
            }
          >
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
                  onPress={() => checkUserTaken()}
                >
                  Update Account
                </Button>
              </div>
            </div>
          </Tab>
          <Tab
            key="security"
            title={
              <div className="flex items-center gap-1.5">
                <Icon icon="solar:shield-keyhole-bold" width={20} />
                <p>Security</p>
              </div>
            }
          >
            <SecuritySettings user={user} />
          </Tab>
          <Tab
            key="subscription"
            title={
              <div className="flex items-center gap-1.5">
                <Icon icon="solar:card-2-broken" width={20} />
                <p>Subscription & Billing</p>
              </div>
            }
          >
            <BillingSettings
              paymentMethods={paymentMethods}
              plans={plans}
              subscription={subscription}
              user={user}
            />
          </Tab>
          <Tab key="quota" title={
              <div className="flex items-center gap-1.5">
                <Icon icon="solar:pie-chart-2-broken" width={20} />
                <p>Quota</p>
              </div>
            }>
            <Quota user={user} plans={plans} stats={stats} />
          </Tab>
          <Tab key="appearance" isDisabled title="Appearance">
            <Card>
              <CardBody>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}
