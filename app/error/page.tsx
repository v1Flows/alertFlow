"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

import { subtitle } from "@/components/primitives";
import { deleteSession } from "@/lib/auth/deleteSession";

export default function MaintenancePage({ reason }: any) {
  const router = useRouter();

  async function pingBackend() {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/health", {
        method: "GET",
      });

      if (res.ok) {
        router.push("/");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  if (!reason) {
    pingBackend();
  }

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center rounded-large justify-center bg-danger bg-opacity-25 w-20 h-20 text-danger">
          <Icon height={64} icon="solar:sad-square-broken" width={64} />
        </div>
        <div>
          <p className="text-6xl font-bold text-center">
            We got an <span className="text-danger">ERROR</span>
          </p>
          <h2 className={subtitle({ class: "mt-4 text-center" })}>
            {reason
              ? reason
              : "error communicating with backend server. Please try again later."}
          </h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            color="danger"
            variant="bordered"
            onPress={() => deleteSession()}
          >
            Log Out
          </Button>
          <Button color="primary" onPress={() => pingBackend()}>
            Reload
          </Button>
          <Button color="primary" onPress={() => router.push("/")}>
            To Home
          </Button>
        </div>
      </div>
    </section>
  );
}
