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

import UpdateExecution from "@/lib/fetch/executions/PUT/update";

export default function AdminExecutionActions({
  execution,
}: {
  execution: any;
}) {
  const router = useRouter();

  async function changeExecutionStatus(status: string) {
    const newExecution = { ...execution };

    switch (status) {
      case "pending":
        newExecution.pending = true;
        newExecution.running = false;
        newExecution.paused = false;
        newExecution.canceled = false;
        newExecution.no_pattern_match = false;
        newExecution.interaction_required = false;
        newExecution.error = false;
        newExecution.finished = false;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "running":
        newExecution.pending = false;
        newExecution.running = true;
        newExecution.paused = false;
        newExecution.canceled = false;
        newExecution.no_pattern_match = false;
        newExecution.interaction_required = false;
        newExecution.error = false;
        newExecution.finished = false;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "paused":
        newExecution.pending = false;
        newExecution.running = false;
        newExecution.paused = true;
        newExecution.canceled = false;
        newExecution.no_pattern_match = false;
        newExecution.interaction_required = false;
        newExecution.error = false;
        newExecution.finished = false;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "canceled":
        newExecution.pending = false;
        newExecution.running = false;
        newExecution.paused = false;
        newExecution.canceled = true;
        newExecution.no_pattern_match = false;
        newExecution.interaction_required = false;
        newExecution.error = false;
        newExecution.finished = false;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : new Date().toISOString();
        break;
      case "no_pattern_match":
        newExecution.pending = false;
        newExecution.running = false;
        newExecution.paused = false;
        newExecution.canceled = false;
        newExecution.no_pattern_match = true;
        newExecution.interaction_required = false;
        newExecution.error = false;
        newExecution.finished = false;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "interaction_required":
        newExecution.pending = false;
        newExecution.running = false;
        newExecution.paused = false;
        newExecution.canceled = false;
        newExecution.no_pattern_match = false;
        newExecution.interaction_required = true;
        newExecution.error = false;
        newExecution.finished = false;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "error":
        newExecution.pending = false;
        newExecution.running = false;
        newExecution.paused = false;
        newExecution.canceled = false;
        newExecution.no_pattern_match = false;
        newExecution.interaction_required = false;
        newExecution.error = true;
        newExecution.finished = false;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : new Date().toISOString();
        break;
      case "finished":
        newExecution.pending = false;
        newExecution.running = false;
        newExecution.paused = false;
        newExecution.canceled = false;
        newExecution.no_pattern_match = false;
        newExecution.interaction_required = false;
        newExecution.error = false;
        newExecution.finished = true;
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : new Date().toISOString();
        break;
      default:
        break;
    }

    const response = await UpdateExecution(newExecution);

    if (response.success) {
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
            key="pending"
            className="capitalize"
            onPress={() => changeExecutionStatus("pending")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-default-500"
                icon="solar:sleeping-square-linear"
                width={18}
              />
              Pending
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
            key="canceled"
            className="capitalize"
            onPress={() => changeExecutionStatus("canceled")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-danger"
                icon="solar:forbidden-linear"
                width={18}
              />
              Canceled
            </div>
          </DropdownItem>
          <DropdownItem
            key="no_pattern_match"
            className="capitalize"
            onPress={() => changeExecutionStatus("no_pattern_match")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-secondary"
                icon="solar:bill-cross-broken"
                width={18}
              />
              No Pattern Match
            </div>
          </DropdownItem>
          <DropdownItem
            key="interaction_required"
            className="capitalize"
            onPress={() => changeExecutionStatus("interaction_required")}
          >
            <div className="flex flex-cols gap-2">
              <Icon
                className="text-primary"
                icon="solar:hand-shake-linear"
                width={18}
              />
              Interaction Required
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
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
