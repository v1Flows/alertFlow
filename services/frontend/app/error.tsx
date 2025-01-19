"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block justify-center text-center">
          <h1 className="text-5xl font-bold text-danger">
            Something went wrong
          </h1>
          <h1 className="mt-4 text-3xl font-bold">Maybe try again? 🤔</h1>
          <p className="mt-4 text-lg text-default-500">
            {error.message || "An unexpected error occurred."}
          </p>
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
