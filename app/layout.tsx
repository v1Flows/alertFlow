import React from "react";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "sonner";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Toaster richColors position="bottom-center" />
          <div className="relative flex flex-col h-screen">
            {children}
            <footer className="w-full flex items-center justify-between py-3">
              <div className="flex items-center justify-center gap-1 pl-4">
                <span className="text-default-600">Powered by</span>
                <p className="text-primary font-bold">JustLab</p>
                <p className="text-default-600">
                  &copy; {new Date().getFullYear()}
                </p>
              </div>
              <p className="text-default-600 flex justify-end pr-4">
                v{siteConfig.version}
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
