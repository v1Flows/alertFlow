"use client";

import { Image, Spacer } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { Icon } from "@iconify/react";

import { title, subtitle } from "@/components/primitives";

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
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
          <div className="flex flex-1 w-full h-full flex-col space-y-2 rounded-md">
            <Image
              isBlurred
              alt="..."
              className="w-full h-full object-cover rounded-md"
              height={600}
              loading="lazy"
              src={`/images/flow_actions_${theme === "light" || isSSR ? "white" : "dark"}.png`}
              width={1200}
            />
          </div>

          <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 items-center justify-center gap-4">
        <div className="flex flex-col items-center text-center">
          <div className="flex bg-primary/20 text-primary items-center rounded-medium justify-center w-16 h-16">
            <Icon icon="solar:reorder-linear" width={48} />
          </div>
          <Spacer y={2} />
          <p className="font-bold text-xl">Reorder Actions</p>
          <p className="text-default-500">
            Drag and drop actions to change the way your flow is executed.
            Besides that you can also switch between two orders. Sequential and
            Parallel.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex bg-primary/20 text-primary items-center rounded-medium justify-center w-16 h-16">
            <Icon icon="solar:list-check-minimalistic-outline" width={48} />
          </div>
          <Spacer y={2} />
          <p className="font-bold text-xl">Pattern Checks</p>
          <p className="text-default-500">
            Define patterns to check the content of your payload before
            executing any action. This way you can ensure that your flow is only
            executed when specific conditions are met.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex bg-primary/20 text-primary items-center rounded-medium justify-center w-16 h-16">
            <Icon icon="solar:branching-paths-up-line-duotone" width={48} />
          </div>
          <Spacer y={2} />
          <p className="font-bold text-xl">Follow the Path</p>
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
