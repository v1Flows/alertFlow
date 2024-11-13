import { Button } from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";

export default function HomeRunners() {
  return (
    <main>
      <div className="flex flex-col items-center text-center">
        <h1 className={title({ size: "lg" })}>
          Executed with{" "}
          <h1 className={title({ color: "violet", size: "lg" })}>Runners.</h1>{" "}
        </h1>
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          Run your actions in any network, any platform, simply.
        </h2>
        <div className="mt-4">
          <Button
            isDisabled
            color="primary"
            radius="lg"
            size="sm"
            variant="flat"
          >
            Learn more
          </Button>
        </div>
      </div>
    </main>
  );
}
