import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
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
        newExecution.status = "pending";
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "running":
        newExecution.status = "running";
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "paused":
        newExecution.status = "paused";
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "canceled":
        newExecution.status = "canceled";
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : new Date().toISOString();
        break;
      case "no_pattern_match":
        newExecution.status = "noPatternMatch";
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "interaction_required":
        newExecution.status = "interactionRequired";
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "error":
        newExecution.status = "error";
        newExecution.finished_at =
          execution.finished_at !== "0001-01-01T00:00:00Z"
            ? execution.finished_at
            : new Date().toISOString();
        break;
      case "finished":
        newExecution.status = "finished";
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
            <div className="flex-cols flex gap-2">
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
            <div className="flex-cols flex gap-2">
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
            <div className="flex-cols flex gap-2">
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
            <div className="flex-cols flex gap-2">
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
            <div className="flex-cols flex gap-2">
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
            <div className="flex-cols flex gap-2">
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
            <div className="flex-cols flex gap-2">
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
            <div className="flex-cols flex gap-2">
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
