import { Icon } from "@iconify/react";
import { Card, CardBody, Spacer } from "@nextui-org/react";

import ChartCard from "./chartCard";

export default function ProjectsStats({
  projects,
  stats,
  interval,
}: {
  projects: any;
  stats: any;
  interval: number;
}) {
  return (
    <div>
      <p className="text-xl font-bold">Projects</p>
      <Spacer y={1} />
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                <Icon icon="solar:box-broken" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">{projects.projects.length}</p>
                <p className="text-sm text-default-500">Total Projects</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex bg-danger/10 text-danger items-center rounded-small justify-center w-10 h-10">
                <Icon icon="solar:box-broken" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {projects.projects.filter((p: any) => p.disabled).length}
                </p>
                <p className="text-sm text-default-500">Disabled Projects</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex bg-danger/10 text-danger items-center rounded-small justify-center w-10 h-10">
                <Icon icon="solar:box-broken" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {
                    projects.projects.filter((p: any) => !p.alertflow_runners)
                      .length
                  }
                </p>
                <p className="text-sm text-default-500">
                  Projects without AlertFlow Runners
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Spacer y={2} />
      <ChartCard
        color="#006fed"
        interval={interval}
        name="created projects"
        stats={stats.project_creation_stats}
      />
    </div>
  );
}
