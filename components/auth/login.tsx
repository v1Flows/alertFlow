/* eslint-disable no-undef */
"use client";
import React, { useState } from "react";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

import { Logout } from "@/lib/logout";
import { MailIcon, LockIcon, LoginIcon } from "@/components/icons";
import { setSession } from "@/lib/setSession";

export default function Login(user: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const userData = user.user;

  async function onLogin() {
    setIsLoginLoading(true);
    const emailInput = document.getElementsByName(
      "email",
    )[0] as HTMLInputElement;
    const email = emailInput.value;

    const passwordInput = document.getElementsByName(
      "password",
    )[0] as HTMLInputElement;
    const password = passwordInput.value;

    const response = await fetch(process.env.API_ENDPOINT + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response) return;

    const { token, user, expires_at } = await response.json();

    setSession(token, user, expires_at);

    if (token) {
      setIsLoginLoading(false);
      onOpenChange();
    } else {
      setIsLoginLoading(false);
      alert("Invalid credentials");
    }
  }

  async function LogoutHandler() {
    await Logout();
  }

  return (
    <>
      {userData?.username && (
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={userData?.username}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Dropdown menu with description"
            variant="faded"
          >
            <DropdownItem key="profile" showDivider>
              Profile
            </DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              onPress={LogoutHandler}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {!userData?.username && (
        <>
          <Button
            color="primary"
            startContent={<LoginIcon className="text-danger" />}
            variant="flat"
            onPress={onOpen}
          >
            Login
          </Button>
          <Modal
            isOpen={isOpen}
            placement="top-center"
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose: any) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Log in
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      required
                      endContent={
                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Email"
                      name="email"
                      placeholder="Enter your email"
                      type="email"
                      variant="bordered"
                    />
                    <Input
                      required
                      endContent={
                        <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Password"
                      name="password"
                      placeholder="Enter your password"
                      type="password"
                      variant="bordered"
                    />
                    <div className="flex py-2 px-1 justify-between">
                      <Checkbox
                        classNames={{
                          label: "text-small",
                        }}
                      >
                        Remember me
                      </Checkbox>
                      <Link color="primary" href="#" size="sm">
                        Forgot password?
                      </Link>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      isLoading={isLoginLoading}
                      onPress={onLogin}
                    >
                      Sign in
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
