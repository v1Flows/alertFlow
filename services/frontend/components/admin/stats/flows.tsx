import { Icon } from "@iconify/react";
import { Card, CardBody, Spacer } from "@heroui/react";

import ChartCard from "../../charts/chartCard";

export default function FlowsStats({
  flows,
  stats,
  interval,
}: {
  flows: any;
  stats: any;
  interval: number;
}) {
  return (
    <div>
      <p className="text-xl font-bold">Flows</p>
      <Spacer y={1} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-small bg-primary/10 text-primary">
                <Icon icon="solar:book-2-outline" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">{flows.length}</p>
                <p className="text-sm text-default-500">Total Flows</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-small bg-danger/10 text-danger">
                <Icon icon="solar:book-2-outline" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {flows.filter((p: any) => p.disabled).length}
                </p>
                <p className="text-sm text-default-500">Disabled Flows</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-small bg-warning/10 text-warning">
                <Icon icon="solar:book-2-outline" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {flows.filter((p: any) => p.maintenance).length}
                </p>
                <p className="text-sm text-default-500">Flows in Maintenance</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Spacer y={2} />
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          color="#006fed"
          interval={interval}
          name="created flows"
          stats={stats.flow_creation_stats}
        />
        <ChartCard
          showTotal
          color="#9353d3"
          interval={interval}
          name="started executions"
          stats={stats.started_execution_stats}
        />
        <ChartCard
          showTotal
          color="#f31260"
          interval={interval}
          name="failed executions"
          stats={stats.failed_execution_stats}
        />
      </div>
      <Spacer y={2} />
      <ChartCard
        showTotal
        color="#006fed"
        interval={interval}
        name="incoming payloads"
        stats={stats.incoming_payload_stats}
      />
    </div>
  );
}
