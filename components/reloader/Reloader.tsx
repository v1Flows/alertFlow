"use client";

import React from "react";
import { Progress } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Reloader() {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
      if (value === 100) {
        clearInterval(interval);
        router.refresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <Progress
      aria-label="Reloading..."
      className="w-40"
      size="sm"
      value={value}
    />
  );
}
