"use client";

import { Icon } from "@iconify/react";
import { Alert } from "@nextui-org/alert";
import { Button, Checkbox, Image, Input, Link } from "@nextui-org/react";
import { useIsSSR } from "@react-aria/ssr";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { setSession } from "@/lib/setSession";
import LoginAPI from "@/lib/auth/login";

import { MailIcon } from "../icons";
import Particles from "../magicui/particles";

export default function LoginPageComponent() {
  const { theme } = useTheme();
  const isSSR = useIsSSR();
  const router = useRouter();

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [usernameEmail, setUsernameEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  async function onLogin() {
    setIsLoginLoading(true);
    setError(false);
    setErrorText("");

    const res = await LoginAPI(usernameEmail, password, rememberMe);

    if (!res.error) {
      await setSession(res.token, res.user, res.expires_at);
      router.push("/dashboard");
      setIsLoginLoading(false);
    } else {
      setIsLoginLoading(false);
      setError(true);
      setErrorText(res.error);
    }
  }

  return (
    <div className="relative flex size-full flex-col items-center justify-center">
      <Particles
        refresh
        className="absolute inset-0"
        color={theme === "light" ? "#000" : "#fff"}
        ease={80}
        quantity={100}
      />
      <div className="flex flex-col items-center pb-2">
        <Image
          alt="Logo"
          height={32}
          radius="none"
          shadow="none"
          src={`https://s3-console.justlab.xyz/api/v1/buckets/alertflow/objects/download?preview=true&prefix=af_logo_${theme === "light" || isSSR ? "black" : "white"}.png`}
          width={32}
        />
        <p className="text-xl font-medium">Welcome Back</p>
        <p className="text-small text-default-500">
          Log in to your account to continue
        </p>
      </div>
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        {error && (
          <Alert color="danger" description={errorText} title="Error" />
        )}
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            required
            endContent={
              <MailIcon className="pointer-events-none shrink-0 text-2xl text-default-400" />
            }
            label="Username / Email"
            name="email"
            placeholder="Enter your username or email"
            type="text"
            value={usernameEmail}
            variant="bordered"
            onValueChange={setUsernameEmail}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            value={password}
            variant="bordered"
            onValueChange={setPassword}
          />
          <div className="flex items-center justify-between px-1 py-2">
            <Checkbox
              isSelected={rememberMe}
              name="remember"
              size="sm"
              onValueChange={setRememberMe}
            >
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <Button
            color="primary"
            isLoading={isLoginLoading}
            type="submit"
            onPress={onLogin}
          >
            Login
          </Button>
        </form>
        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="/auth/signup" size="sm">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
