"use client";

import { Icon } from "@iconify/react";

import { subtitle } from "@/components/primitives";
import { useRouter } from "next/navigation";

export default function MaintenancePage({ reason }: any) {
  const router = useRouter();

  async function pingBackend() {
    try {
      const res = await fetch(process.env.API_ENDPOINT + "/health", {
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
        <p className="text-6xl font-bold text-center">
          We got an <span className="text-danger">ERROR</span>
        </p>
        <h2 className={subtitle({ class: "mt-4 text-center" })}>
          {reason
            ? reason
            : "error communicating with backend server. Please try again later."}
        </h2>
      </div>
    </section>
  );
}
