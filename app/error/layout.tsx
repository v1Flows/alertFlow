import React from "react";

export default function DashboardHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="container mx-auto max-w-7xl pt-2 px-6 flex-grow">
        {children}
      </main>
    </>
  );
}
