import { Button, Spacer } from "@nextui-org/react";

import { subtitle, title } from "@/components/primitives";

export default function HomeTerraform() {
  return (
    <main>
      <div className="flex flex-col items-center text-center">
        <h1 className={title({ size: "lg" })}>
          Versioned within{" "}
          <span className={title({ color: "blue", size: "lg" })}>
            Terraform.
          </span>
        </h1>
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          Infrastructure as code to build, change, and version your AlertFlow
          experience. Now with our Terraform provider.
        </h2>
        <div className="mt-4">
          <Button
            isDisabled
            color="primary"
            radius="lg"
            size="sm"
            variant="flat"
          >
            Coming soon
          </Button>
        </div>
        <Spacer y={8} />
      </div>
    </main>
  );
}
