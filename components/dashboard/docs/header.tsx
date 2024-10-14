import { PlusIcon } from "@/components/icons";
import { Icon } from "@iconify/react";
import { Button } from "@nextui-org/react";

export default function DashboardDocsHeader() {
    return (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 items-center justify-between">
            <p className="text-2xl font-bold">Documentation</p>
            <div className="flex flex-cols justify-end items-center gap-4">
                <Button
                    color="danger"
                    variant="flat"
                    startContent={<Icon icon="solar:crown-line-line-duotone" width={20} />}
                >
                    Add Documentation
                </Button>
            </div>
        </div>
    );
}