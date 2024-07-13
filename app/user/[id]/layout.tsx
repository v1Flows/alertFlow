import React from "react";

import { Navbar } from "@/components/navbar";

export default function DashboardHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-2 px-6 flex-grow">
        {children}
      </main>
    </>
  );
}
