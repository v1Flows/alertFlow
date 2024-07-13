"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block text-center justify-center">
          <h1 className="text-5xl font-bold text-danger">
            Something went wrong
          </h1>
          <h1 className="text-3xl font-bold mt-4">Maybe try again? 🤔</h1>
          <div className="mt-6 flex justify-center gap-4">
            <Button className="mt-4" radius="sm" onPress={() => reset()}>
              Reload
            </Button>
            <Button
              className="mt-4"
              color="primary"
              radius="sm"
              variant="flat"
              onPress={() => router.push("/")}
            >
              To Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
