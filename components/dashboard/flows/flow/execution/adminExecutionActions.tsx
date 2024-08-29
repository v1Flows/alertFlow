import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import UpdateExecution from "@/lib/fetch/executions/update";

export default function AdminExecutionActions({
  execution,
}: {
  execution: any;
}) {
  const router = useRouter();

  async function changeExecutionStatus(status: string) {
    const newExecution = { ...execution };

    switch (status) {
      case "finished":
        newExecution.error = false;
        newExecution.ghost = false;
        newExecution.no_match = false;
        newExecution.paused = false;
        newExecution.running = false;
        newExecution.waiting = false;
        newExecution.finished_at = new Date().toISOString();
        break;
      case "running":
        newExecution.error = false;
        newExecution.ghost = false;
        newExecution.no_match = false;
        newExecution.paused = false;
        newExecution.running = true;
        newExecution.waiting = false;
        newExecution.finished_at = "0001-01-01T00:00:00Z";
        break;
      case "waiting":
        newExecution.error = false;
        newExecution.ghost = false;
        newExecution.no_match = false;
        newExecution.paused = false;
        newExecution.running = false;
        newExecution.waiting = true;
        newExecution.finished_at = "0001-01-01T00:00:00Z";
        break;
      case "paused":
        newExecution.error = false;
        newExecution.ghost = false;
        newExecution.no_match = false;
        newExecution.paused = true;
        newExecution.running = false;
        newExecution.waiting = false;
        newExecution.finished_at = "0001-01-01T00:00:00Z";
        break;
      case "no_match":
        newExecution.error = false;
        newExecution.ghost = false;
        newExecution.no_match = true;
        newExecution.paused = false;
        newExecution.running = false;
        newExecution.waiting = false;
        newExecution.finished_at = new Date().toISOString();
        break;
      case "ghost":
        newExecution.error = false;
        newExecution.ghost = true;
        newExecution.no_match = false;
        newExecution.paused = false;
        newExecution.running = false;
        newExecution.waiting = false;
        newExecution.finished_at = new Date().toISOString();
        break;
      case "error":
        newExecution.error = true;
        newExecution.ghost = false;
        newExecution.no_match = false;
        newExecution.paused = false;
        newExecution.running = false;
        newExecution.waiting = false;
        newExecution.finished_at = new Date().toISOString();
        break;
      default:
        break;
    }

    const response = await UpdateExecution(newExecution);

    if (response.result === "success") {
      toast.success("Execution Status Changed");
      router.refresh();
    } else {
      toast.error("Failed to change Execution Status");
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="danger" variant="flat">
          <Icon icon="solar:shield-up-broken" width={20} />
          Admin Actions
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Table Columns" variant="flat">
        <DropdownSection title="Change Execution Status">
          <DropdownItem
            key="finished"
            className="capitalize"
            onPress={() => changeExecutionStatus("finished")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-success"
                icon="solar:check-read-broken"
                width={18}
              />
              Finished
            </div>
          </DropdownItem>
          <DropdownItem
            key="running"
            className="capitalize"
            onPress={() => changeExecutionStatus("running")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-primary"
                icon="solar:play-bold-duotone"
                width={18}
              />
              Running
            </div>
          </DropdownItem>
          <DropdownItem
            key="waiting"
            className="capitalize"
            onPress={() => changeExecutionStatus("waiting")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-warning"
                icon="solar:clock-circle-broken"
                width={18}
              />
              Waiting
            </div>
          </DropdownItem>
          <DropdownItem
            key="paused"
            className="capitalize"
            onPress={() => changeExecutionStatus("paused")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-warning"
                icon="solar:pause-broken"
                width={18}
              />
              Paused
            </div>
          </DropdownItem>
          <DropdownItem
            key="no_pattern_match"
            className="capitalize"
            onPress={() => changeExecutionStatus("no_match")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-secondary"
                icon="solar:bill-cross-broken"
                width={18}
              />
              No Match
            </div>
          </DropdownItem>
          <DropdownItem
            key="no_flow_actions_found"
            className="capitalize"
            onPress={() => changeExecutionStatus("ghost")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-default-500"
                icon="solar:ghost-broken"
                width={18}
              />
              Ghost
            </div>
          </DropdownItem>
          <DropdownItem
            key="error"
            className="capitalize"
            onPress={() => changeExecutionStatus("error")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-danger"
                icon="solar:danger-triangle-broken"
                width={18}
              />
              Error
            </div>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
