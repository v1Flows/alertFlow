/* eslint-disable no-undef */
"use client";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import SignUpAPI from "@/lib/auth/signup";

import { EyeFilledIcon, EyeSlashFilledIcon } from "../icons";
import SuccessSignUpModal from "../functions/auth/successSignUp";

export default function SignUp({ settings }: any) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const successSignUpModal = useDisclosure();

  async function SignUpHandler() {
    setIsLoading(true);
    const res = await SignUpAPI(email, username, password);

    if (res.error) {
      setIsLoading(false);
      toast.error(res.error);
    } else {
      setIsLoading(false);
      successSignUpModal.onOpen();
    }
  }

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <Card isBlurred>
          <CardHeader className="flex flex-col items-start justify-start">
            <div className="flex items-center justify-center">
              <p className="text-2xl font-bold">SignUp to&nbsp;</p>
              <p className="text-2xl font-bold text-primary">AlertFlow</p>
            </div>
            <p className="text-sm text-default-500">
              {" "}
              Enter your informations to create an account.
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Input
                isRequired
                label="Username"
                size="sm"
                type="username"
                value={username}
                variant="flat"
                onValueChange={setUsername}
              />
              <Input
                isRequired
                label="Email"
                size="sm"
                type="email"
                value={email}
                variant="flat"
                onValueChange={setEmail}
              />
            </div>
            <Input
              isRequired
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Password"
              size="sm"
              type={isVisible ? "text" : "password"}
              value={password}
              variant="flat"
              onValueChange={setPassword}
            />
          </CardBody>
          <CardFooter className="flex flex-col gap-2">
            <Button
              fullWidth
              color="primary"
              isDisabled={!settings.signup}
              isLoading={isLoading}
              size="md"
              variant="flat"
              onClick={SignUpHandler}
            >
              Create an account
            </Button>
            <p className="text-sm text-default-500">
              Already have an account?{" "}
              <Link color="secondary" href="/" size="sm">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <SuccessSignUpModal disclosure={successSignUpModal} />
    </>
  );
}
