'use client'
import React, { useState } from "react";
import { User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, cn } from "@nextui-org/react";
import { MailIcon, LockIcon, LoginIcon, AddNoteIcon, CopyDocumentIcon, EditDocumentIcon, DeleteDocumentIcon } from '@/components/icons';
import Logout from "./logout";

export default function Login() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function onLogin() {
    setIsLoginLoading(true);
    const emailInput = document.getElementsByName("email")[0] as HTMLInputElement;
    const email = emailInput.value;

    const passwordInput = document.getElementsByName("password")[0] as HTMLInputElement;
    const password = passwordInput.value;

    const response = await fetch("http://localhost:8080/api/token", {
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

    const { token, user } = await response.json();

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (token) {
      setIsLoginLoading(false);
      onOpenChange()
    } else {
      setIsLoginLoading(false);
      alert("Invalid credentials");
    }
  }

  return (
    <>
      {user.username && (
        <Dropdown>
          <DropdownTrigger>
            <User   
              name={user.username}
              description={user.email}
              avatarProps={{
                name: user.username
              }}
              className="hover:cursor-pointer hover:opacity-80"
            />
          </DropdownTrigger>
          <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
            <DropdownItem
              key="new"
              description="Go to your profile"
              showDivider
              startContent={<AddNoteIcon className={iconClasses} />}
            >
              Profile
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Log out of your account"
              startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
              onPress={Logout}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {!user.username && (
        <>
          <Button
            startContent={<LoginIcon className="text-danger" />}
            onPress={onOpen}
            color="primary"
            variant="flat"
          >
            Login
          </Button>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose: any) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
                  <ModalBody>
                    <Input
                      autoFocus
                      endContent={
                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Email"
                      placeholder="Enter your email"
                      variant="bordered"
                      type="email"
                      required
                      name="email"
                    />
                    <Input
                      endContent={
                        <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                      variant="bordered"
                      required
                      name="password"
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
                    <Button isLoading={isLoginLoading} color="primary" onPress={onLogin}>
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
