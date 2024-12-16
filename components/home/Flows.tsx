"use client";

import { Icon } from "@iconify/react";
import { Image, Spacer } from "@nextui-org/react";
import { useIsSSR } from "@react-aria/ssr";
import { useTheme } from "next-themes";

import { subtitle, title } from "@/components/primitives";

export default function HomeFlows() {
  const { theme } = useTheme();
  const isSSR = useIsSSR();

  return (
    <main>
      <div className="flex flex-col items-center text-center">
        <h1 className={title({ size: "lg" })}>
          Designed by{" "}
          <span className={title({ color: "yellow", size: "lg" })}>Flows.</span>{" "}
        </h1>
        <h2 className={subtitle({ class: "mt-4 text-default-500" })}>
          Flow your data, your way, with Flows. Define actions, patterns,
          execution order and more.
        </h2>
        <div className="relative flex h-full flex-col items-start gap-10 overflow-hidden p-8">
          <div className="flex size-full flex-1 flex-col space-y-2 rounded-md">
            <Image
              isBlurred
              alt="..."
              className="size-full rounded-md object-cover"
              loading="lazy"
              src={`/images/flow_actions_${theme === "light" || isSSR ? "white" : "dark"}.png`}
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-60 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
        </div>
      </div>
      <div className="grid grid-cols-1 items-center justify-center gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-medium bg-warning/20 text-warning">
            <Icon icon="solar:reorder-linear" width={38} />
          </div>
          <Spacer y={2} />
          <p className="text-xl font-bold">Reorder Actions</p>
          <p className="text-default-500">
            Drag and drop actions to change the way your flow is executed.
            Besides that you can also switch between two orders. Sequential and
            Parallel.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-medium bg-warning/20 text-warning">
            <Icon icon="solar:list-check-minimalistic-outline" width={38} />
          </div>
          <Spacer y={2} />
          <p className="text-xl font-bold">Pattern Checks</p>
          <p className="text-default-500">
            Define patterns to check the content of your payload before
            executing any action. This way you can ensure that your flow is only
            executed when specific conditions are met.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-medium bg-warning/20 text-warning">
            <Icon icon="solar:branching-paths-up-line-duotone" width={38} />
          </div>
          <Spacer y={2} />
          <p className="text-xl font-bold">Follow the Path</p>
          <p className="text-default-500">
            All incoming payloads are listed in the flow. You can see which
            runner processed it and if there is any related execution to this
            payload.
          </p>
        </div>
      </div>
    </main>
  );
}
