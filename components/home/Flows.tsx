import { Button } from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";

export default function HomeFlows() {
  return (
    <main>
      <div className="flex flex-col items-center text-center">
        <h1 className={title({ size: "lg" })}>
          Designed by{" "}
          <h1 className={title({ color: "yellow", size: "lg" })}>Flows.</h1>{" "}
        </h1>
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          Flow your data, your way, with Flows. Define actions, patterns,
          execution order and more.
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
