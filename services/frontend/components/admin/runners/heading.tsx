import { Divider } from "@heroui/react";

import Reloader from "@/components/reloader/Reloader";

export function RunnersHeading() {
  return (
    <main>
      <div className="grid items-center justify-between lg:grid-cols-2">
        <div className="flex items-center space-x-1">
          <p className="mb-0 text-2xl font-bold text-danger">Admin</p>
          <p className="mb-0 text-2xl">|</p>
          <p className="mb-0 text-2xl">Runners</p>
        </div>
        <div className="mt-2 lg:mt-0 lg:justify-self-end">
          <Reloader />
        </div>
      </div>
      <Divider className="my-4" />
    </main>
  );
}
