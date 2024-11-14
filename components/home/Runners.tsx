"use client";
import { Image, Spacer } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { Icon } from "@iconify/react";

import { title, subtitle } from "@/components/primitives";

export default function HomeRunners() {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

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
      <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-4">
        <div className="relative flex py-8 px-2 gap-10 h-full">
          <div className="w-full p-5 mx-auto bg-transparent group h-full">
            <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
              <Image
                alt="header"
                className="h-full w-full"
                height={400}
                src={`/images/runner_${theme === "light" || isSSR ? "white" : "dark"}.png`}
                width={450}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-cols items-center gap-4">
            <div className="flex bg-secondary/20 text-secondary items-center rounded-medium justify-center w-16 h-16">
              <Icon icon="solar:plug-circle-linear" width={48} />
            </div>
            <div className="text-start">
              <p className="font-bold text-xl">Plugins</p>
              <p className="text-default-500">
                Define patterns to check the content of your payload before
                executing any action. This way you can ensure that your flow is
                only executed when specific conditions are met.
              </p>
            </div>
          </div>

          <div className="flex flex-cols items-center gap-4">
            <div className="flex bg-secondary/20 text-secondary items-center rounded-medium justify-center w-16 h-16">
              <Icon icon="solar:heart-pulse-linear" width={48} />
            </div>
            <div className="text-start">
              <p className="font-bold text-xl">Health Checks</p>
              <p className="text-default-500">
                Define patterns to check the content of your payload before
                executing any action. This way you can ensure that your flow is
                only executed when specific conditions are met.
              </p>
            </div>
          </div>

          <div className="flex flex-cols items-center gap-4">
            <div className="flex bg-secondary/20 text-secondary items-center rounded-medium justify-center w-16 h-16">
              <Icon icon="solar:settings-linear" width={48} />
            </div>
            <div className="text-start">
              <p className="font-bold text-xl">Modes</p>
              <p className="text-default-500">
                Define patterns to check the content of your payload before
                executing any action. This way you can ensure that your flow is
                only executed when specific conditions are met.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
