import { Divider } from "@nextui-org/react";

export function RunnersHeading() {
  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="mb-0 text-2xl font-bold text-danger">Admin</p>
          <p className="mb-0 text-2xl">|</p>
          <p className="mb-0 text-2xl">Runners</p>
        </div>
      </div>
      <Divider className="my-4" />
    </main>
  );
}
