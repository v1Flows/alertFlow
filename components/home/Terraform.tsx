import { Button } from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";

export default function HomeTerraform() {
  return (
    <main>
      <div className="items-center justify-start">
        <h1 className={title({ size: "lg" })}>Automate with</h1>
        <br />
        <h1 className={title({ color: "blue", size: "lg" })}>Terraform.</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          You can use our own developed Terraform provider to automate <br />
          your AlertFlow experience.
        </h2>
        <div className="mt-4">
          <Button color="primary" radius="lg" size="sm" variant="flat">
            Learn more
          </Button>
        </div>
      </div>
    </main>
  );
}
