import { Divider } from "@nextui-org/react";

export function RunnersHeading() {
  return (
    <main>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <p className="text-2xl font-bold mb-0 text-danger">Admin</p>
          <p className="text-2xl mb-0">|</p>
          <p className="text-2xl mb-0">Runners</p>
        </div>
      </div>
      <Divider className="my-4" />
    </main>
  );
}