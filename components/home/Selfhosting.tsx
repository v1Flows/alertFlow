import { Button } from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";

export default function HomeSelfhosting() {
  return (
    <main>
      <div className="items-center justify-start">
        <h1 className={title({ size: "lg" })}>What about</h1>
        <br />
        <h1 className={title({ color: "yellow", size: "lg" })}>
          Self-Hosting?
        </h1>
        <br />
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          Hosting a full AlertFlow Instance on your own Infrastructure is not
          supported yet.
          <br />
          But in case your are working in an Isolated Environment or have
          security concerns,
          <br /> you can host your own Runners.
        </h2>
        <div className="mt-4">
          <Button
            isDisabled
            color="warning"
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
