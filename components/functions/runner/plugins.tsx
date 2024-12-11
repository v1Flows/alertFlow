import { Icon } from "@iconify/react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@nextui-org/drawer";
import { Chip, Divider } from "@nextui-org/react";
import { UseDisclosureReturn } from "@nextui-org/use-disclosure";

export default function RunnerPluginDrawer({
  disclosure,
  runner,
}: {
  disclosure: UseDisclosureReturn;
  runner: any;
}) {
  const { isOpen, onOpenChange } = disclosure;

  return (
    <Drawer isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">
                {runner.name} Runner Plugins
              </h3>
              <Chip size="sm" variant="flat">
                {runner.plugins.length}
              </Chip>
            </DrawerHeader>
            <DrawerBody>
              {runner.plugins.map((plugin: any) => (
                <div
                  key={plugin.name}
                  className="flex flex-col items-start w-full"
                >
                  <div className="flex flex-col items-start justify-between w-full">
                    <div className="flex flex-cols gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                          <Icon
                            icon={
                              plugin.type === "action"
                                ? "solar:bolt-linear"
                                : "solar:letter-opened-linear"
                            }
                            width={20}
                          />
                        </div>
                        <div>
                          <p className="font-bold">{plugin.name}</p>
                          <p className="text-sm text-default-500">
                            Creator: {plugin.creator || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start justify-self-end gap-2">
                        <Chip
                          color="primary"
                          radius="sm"
                          size="sm"
                          variant="flat"
                        >
                          Version: {plugin.version || "N/A"}
                        </Chip>
                        <Chip
                          color="secondary"
                          radius="sm"
                          size="sm"
                          variant="flat"
                        >
                          Type: {plugin.type || "N/A"}
                        </Chip>
                      </div>
                    </div>
                    <Divider className="mt-3 w-full" />
                  </div>
                </div>
              ))}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
