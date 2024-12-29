"use client";
import { Icon } from "@iconify/react";
import { Spacer } from "@nextui-org/react";

import { subtitle, title } from "@/components/primitives";

export default function HomeRunners() {
  return (
    <main>
      <div className="flex flex-col items-center text-center">
        <h1 className={title({ size: "lg" })}>
          Executed with{" "}
          <span className={title({ color: "violet", size: "lg" })}>
            Runners.
          </span>{" "}
        </h1>
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          Run your actions in any network, any platform, simply.
        </h2>
      </div>
      <Spacer y={8} />
      <div className="flex flex-wrap w-full items-center gap-4 justify-center">
        <div className="flex-cols flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-medium bg-secondary/20 text-secondary">
            <Icon icon="solar:globus-linear" width={38} />
          </div>
          <div className="text-start">
            <p className="text-xl font-bold">Connect from Everywhere</p>
            <p className="max-w-[500px] text-default-500">
              Runners can be deployed on your own infrastructure, in the cloud,
              or even on your own machine. This way you can ensure that your
              actions are executed in the most secure and efficient way.
            </p>
          </div>
        </div>

        <div className="flex-cols flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-medium bg-secondary/20 text-secondary">
            <Icon icon="solar:plug-circle-linear" width={38} />
          </div>
          <div className="text-start">
            <p className="text-xl font-bold">Plugins</p>
            <p className="max-w-[500px] text-default-500">
              Extend the capabilities of your runners with plugins. You can
              create your own plugins or use the ones that are already available
              in the marketplace.
            </p>
          </div>
        </div>

        <div className="flex-cols flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-medium bg-secondary/20 text-secondary">
            <Icon icon="solar:heart-pulse-linear" width={38} />
          </div>
          <div className="text-start">
            <p className="text-xl font-bold">Health Checks</p>
            <p className="max-w-[500px] text-default-500">
              Monitor the health of your runners with health checks. Runners
              will send every 10 seconds a heartbeat to the server to ensure
              that they are still alive.
            </p>
          </div>
        </div>

        <div className="flex-cols flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-medium bg-secondary/20 text-secondary">
            <Icon icon="solar:settings-linear" width={38} />
          </div>
          <div className="text-start">
            <p className="text-xl font-bold">Modes</p>
            <p className="max-w-[500px] text-default-500">
              Different modes are available for runners depending on your need.
              They can only accept payload, execute flows, or both.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
