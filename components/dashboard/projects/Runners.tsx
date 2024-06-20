import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Button,
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import { VerticalDotsIcon, DeleteDocumentIcon } from "@/components/icons";
import DeleteProjectRunner from "@/lib/fetch/project/DELETE/DeleteRunner";

import AddRunnerModal from "./project/AddRunner";

export default function Runners({ runners, project }: any) {
  const router = useRouter();

  async function handleDeleteRunner(runnerID: any) {
    const response = await DeleteProjectRunner(runnerID);

    if (response.result === "success") {
      toast.success("Runner deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete runner");
    }
  }

  return (
    <main>
      <Toaster richColors position="bottom-center" />
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-bold">Selfhosted Runners</p>
        <AddRunnerModal projectID={project.id} />
      </div>
      <Divider className="mb-4" />
      <div className="grid grid-cols-2 gap-4">
        {runners.map(
          (runner: any) =>
            runner.alertflow_runner === false && (
              <Card key={runner.id}>
                <CardHeader className="justify-between items-center">
                  <div>
                    <p className="text-md">{runner.name}</p>
                    <p className="text-sm text-default-500">{runner.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      color={runner.registered ? "success" : "danger"}
                      size="sm"
                      variant="dot"
                    >
                      {runner.registered ? "Registered" : "Unregistered"}
                    </Chip>
                    <div className="relative flex justify-end items-center gap-2">
                      <Dropdown backdrop="opaque">
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <VerticalDotsIcon
                              className="text-default-300"
                              height={undefined}
                              width={undefined}
                            />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownSection title="Danger zone">
                            <DropdownItem
                              className="text-danger"
                              color="danger"
                              startContent={<DeleteDocumentIcon />}
                              onClick={() => handleDeleteRunner(runner.id)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownSection>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-2 grid-rows-3 items-center justify-center">
                    <p className="text-sm">Version:</p>
                    <p className="text-sm">{runner.runner_version}</p>
                    <p className="text-sm">Active:</p>
                    <p className="text-sm">{runner.active ? "Yes" : "No"}</p>
                    <p className="text-sm">Last Heartbeat:</p>
                    <p className="text-sm">
                      {new Date(runner.last_heartbeat.Time).toLocaleString()}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ),
        )}
      </div>

      <p className="text-lg font-bold mt-4 mb-4">AlertFlow Runners</p>
      <Divider className="mb-4" />
      {project.alertflow_runners === true && (
        <div>
          <div className="grid grid-cols-2 gap-4">
            {runners.map(
              (runner: any) =>
                runner.alertflow_runner === true && (
                  <Card key={runner.id}>
                    <CardHeader>
                      <div>
                        <p className="text-md">{runner.name}</p>
                        <p className="text-sm text-default-500">{runner.id}</p>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <div className="grid grid-cols-2 grid-rows-3 items-center justify-center">
                        <p className="text-sm">Version:</p>
                        <p>{runner.runner_version}</p>
                        <p className="text-sm">Active:</p>
                        <p>{runner.active ? "Yes" : "No"}</p>
                        <p className="text-sm">Last Heartbeat:</p>
                        <p>
                          {new Date(
                            runner.last_heartbeat.Time,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ),
            )}
          </div>
        </div>
      )}
      {project.alertflow_runners === false && (
        <div>
          <p className="text-sm text-default-500 font-bold mt-4 mb-4">
            AlertFlow runners are disabled
          </p>
        </div>
      )}
    </main>
  );
}
