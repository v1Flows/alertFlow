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

import UpdateExecutionStep from "@/lib/fetch/executions/PUT/updateStep";

export default function AdminStepActions({
  execution,
  step,
}: {
  execution: any;
  step: any;
}) {
  const router = useRouter();

  async function changeStepStatus(status: string) {
    const newStep = { ...step };

    switch (status) {
      case "pending":
        newStep.pending = true;
        newStep.running = false;
        newStep.paused = false;
        newStep.canceled = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.error = false;
        newStep.finished = false;
        newStep.action_messages = ["Action Status changed by Admin to Pending"];
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "running":
        newStep.pending = false;
        newStep.running = true;
        newStep.paused = false;
        newStep.canceled = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.error = false;
        newStep.finished = false;
        newStep.action_messages = ["Action Status changed by Admin to Running"];
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "paused":
        newStep.pending = false;
        newStep.running = false;
        newStep.paused = true;
        newStep.canceled = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.error = false;
        newStep.finished = false;
        newStep.action_messages = ["Action Status changed by Admin to Paused"];
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "canceled":
        newStep.pending = false;
        newStep.running = false;
        newStep.paused = false;
        newStep.canceled = true;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.error = false;
        newStep.finished = false;
        newStep.action_messages = [
          "Action Status changed by Admin to Canceled",
        ];
        newStep.canceled_by = "admin";
        newStep.canceled_at = new Date().toISOString();
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : new Date().toISOString();
        break;
      case "no_pattern_match":
        newStep.pending = false;
        newStep.running = false;
        newStep.paused = false;
        newStep.canceled = false;
        newStep.no_pattern_match = true;
        newStep.no_result = false;
        newStep.error = false;
        newStep.finished = false;
        newStep.action_messages = [
          "Action Status changed by Admin to No Pattern Match",
        ];
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "no_result":
        newStep.pending = false;
        newStep.running = false;
        newStep.paused = false;
        newStep.canceled = false;
        newStep.no_pattern_match = false;
        newStep.no_result = true;
        newStep.error = false;
        newStep.finished = false;
        newStep.action_messages = [
          "Action Status changed by Admin to No Result",
        ];
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : "0001-01-01T00:00:00Z";
        break;
      case "error":
        newStep.pending = false;
        newStep.running = false;
        newStep.paused = false;
        newStep.canceled = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.error = true;
        newStep.finished = false;
        newStep.action_messages = ["Action Status changed by Admin to Error"];
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : new Date().toISOString();
        break;
      case "finished":
        newStep.pending = false;
        newStep.running = false;
        newStep.paused = false;
        newStep.canceled = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.error = false;
        newStep.finished = true;
        newStep.action_messages = [
          "Action Status changed by Admin to Finished",
        ];
        newStep.finished_at =
          step.finished_at !== "0001-01-01T00:00:00Z"
            ? step.finished_at
            : new Date().toISOString();
        break;
      default:
        break;
    }

    const response = await UpdateExecutionStep(execution, newStep);

    if (response.success) {
      toast.success("Step Status Changed");
      router.refresh();
    } else {
      toast.error("Failed to change Step Status");
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly color="danger" variant="flat">
          <Icon icon="solar:shield-up-broken" width={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Table Columns" variant="flat">
        <DropdownSection title="Change Execution Status">
          <DropdownItem
            key="pending"
            className="capitalize"
            onPress={() => changeStepStatus("pending")}
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
            onPress={() => changeStepStatus("running")}
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
            onPress={() => changeStepStatus("paused")}
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
            onPress={() => changeStepStatus("canceled")}
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
            onPress={() => changeStepStatus("no_pattern_match")}
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
            key="no_flow_actions_found"
            className="capitalize"
            onPress={() => changeStepStatus("no_result")}
          >
            <div className="flex-cols flex gap-2">
              <Icon
                className="text-default-500"
                icon="solar:ghost-broken"
                width={18}
              />
              No Result
            </div>
          </DropdownItem>
          <DropdownItem
            key="error"
            className="capitalize"
            onPress={() => changeStepStatus("error")}
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
            onPress={() => changeStepStatus("finished")}
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
