import UpdateExecutionStep from "@/lib/fetch/executions/updateStep";
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
      case "finished":
        newStep.error = false;
        newStep.finished = true;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.paused = false;
        newStep.action_messages = [
          "Action Status changed by Admin to Finished",
        ];
        newStep.finished_at = new Date().toISOString();
        break;
      case "running":
        newStep.error = false;
        newStep.finished = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.paused = false;
        newStep.action_messages = ["Action Status changed by Admin to Running"];
        newStep.finished_at = "0001-01-01T00:00:00Z";
        break;
      case "paused":
        newStep.error = false;
        newStep.finished = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.paused = true;
        newStep.action_messages = ["Action Status changed by Admin to Paused"];
        newStep.finished_at = "0001-01-01T00:00:00Z";
        break;
      case "no_pattern_match":
        newStep.error = false;
        newStep.finished = false;
        newStep.no_pattern_match = true;
        newStep.no_result = false;
        newStep.paused = false;
        newStep.action_messages = [
          "Action Status changed by Admin to No Pattern Match",
        ];
        newStep.finished_at = new Date().toISOString();
        break;
      case "no_result":
        newStep.error = false;
        newStep.finished = true;
        newStep.no_pattern_match = false;
        newStep.no_result = true;
        newStep.paused = false;
        newStep.action_messages = [
          "Action Status changed by Admin to No Result",
        ];
        newStep.finished_at = new Date().toISOString();
        break;
      case "error":
        newStep.error = true;
        newStep.finished = false;
        newStep.no_pattern_match = false;
        newStep.no_result = false;
        newStep.paused = false;
        newStep.action_messages = ["Action Status changed by Admin to Error"];
        newStep.finished_at = new Date().toISOString();
        break;
      default:
        break;
    }

    const response = await UpdateExecutionStep(execution, newStep);

    if (response.result === "success") {
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
            key="finished"
            className="capitalize"
            onPress={() => changeStepStatus("finished")}
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
            onPress={() => changeStepStatus("running")}
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
            onPress={() => changeStepStatus("paused")}
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
            onPress={() => changeStepStatus("no_pattern_match")}
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
            key="no_flow_actions_found"
            className="capitalize"
            onPress={() => changeStepStatus("no_result")}
          >
            <div className="flex flex-cols gap-2">
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
