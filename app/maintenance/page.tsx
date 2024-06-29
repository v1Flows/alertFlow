import { Button } from "@nextui-org/react";
import { RefreshCwIcon } from "lucide-react";
import { cookies } from "next/headers";

import { title, subtitle } from "@/components/primitives";
import Login from "@/components/auth/login";

export default function MaintenancePage() {
  const user = JSON.parse(cookies().get("user")?.value || "{}");
  const session = cookies().get("session")?.value;

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title({ color: "blue" })}>Maintenance&nbsp;</h1>
        <h1 className={title()}>Mode&nbsp;</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          We are currently in maintenance mode. Please come back later.
          Apologies for the inconvenience.
        </h2>
        <div className="mt-8 flex justify-center gap-4">
          <Login session={session} user={user} />
        </div>
      </div>
    </section>
  );
}
