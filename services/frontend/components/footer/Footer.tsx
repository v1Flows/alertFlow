"use client";

import { Icon } from "@iconify/react";
import { Image, Link, Spacer } from "@heroui/react";
import { useIsSSR } from "@react-aria/ssr";
import { useTheme } from "next-themes";
import React from "react";

import { siteConfig } from "@/config/site";

const navLinks = [
  {
    name: "GitHub",
    href: "https://github.com/AlertFlow/alertflow",
  },
  {
    name: "Components",
    href: "https://github.com/orgs/AlertFlow/repositories",
  },
];

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="sticky top-[100vh] flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center">
          <Image
            alt="Logo"
            height={32}
            radius="none"
            shadow="none"
            src={`/images/af_logo_${theme === "light" ? "black" : "white"}.png`}
            width={32}
          />
          <span className="text-medium font-medium">AlertFlow</span>
        </div>
        <Spacer y={4} />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              isExternal
              className="text-default-500"
              href={item.href}
              size="sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Spacer y={4} />
        <p className="mt-1 text-center text-small text-default-400">
          &copy; 2025 AlertFlow. All rights reserved. Version{" "}
          {siteConfig.version}
        </p>
        <p className="mt-1 flex gap-1 text-center text-small text-default-400">
          Made with <Icon icon="solar:hand-heart-linear" width={16} /> in
          Germany
        </p>
      </div>
    </footer>
  );
}
