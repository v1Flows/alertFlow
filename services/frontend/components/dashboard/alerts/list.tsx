import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function AlertsList({ alerts }: any) {
  return (
    <main>
      {alerts.map((alert: any) => (
        <Card key={alert.id} fullWidth>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-small bg-danger/10 text-danger">
                <Icon icon="hugeicons:fire" width={24} />
              </div>
              <div>
                <p className="text-md font-bold text-danger">{alert.name}</p>
                <p className="text-sm text-default-500">Firing</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </main>
  );
}
