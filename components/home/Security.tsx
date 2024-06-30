import { Button } from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";

export default function HomeSecurity() {
  return (
    <main>
      <div className="items-center justify-start">
        <h1 className={title({ color: "green", size: "lg" })}>Secruity</h1>
        <br />
        <h1 className={title({ size: "lg" })}>is our priority.</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          User data, payloads, executions are encrypted and stored securely.{" "}
          <br />
          You can checkout our security documentation to see how your data is
          treated <br /> at AlertFlow.
        </h2>
        <div className="mt-4">
          <Button color="success" radius="lg" size="sm" variant="flat">
            Learn more
          </Button>
        </div>
      </div>
    </main>
  );
}
