import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

export default function Actions({ actions }: { actions: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action: any, index: number) => (
        <Card key={index}>
          <CardHeader className="flex justify-between gap-4">
            <div className="flex flex-cols items-center gap-4">
              <div className="flex flex-col items-start">
                <p className="text-lg font-bold">{action.name}</p>
                <p className="text-sm text-default-500">{action.description}</p>
              </div>
              <Chip
                color={action.status ? "success" : "danger"}
                radius="sm"
                size="sm"
                variant="flat"
              >
                <p className="font-bold">
                  Status: {action.status ? "Active" : "Disabled"}
                </p>
              </Chip>
            </div>
            <div>
              <Button isIconOnly color="warning" variant="light">
                <Icon icon="solar:pen-new-square-broken" width={22} />
              </Button>
              <Button isIconOnly color="danger" variant="light">
                <Icon icon="solar:trash-bin-trash-broken" width={22} />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap items-center justify-between gap-8">
              {/* Action Execution Order */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon
                    icon={
                      action.exec_parallel
                        ? "solar:align-horizontal-center-outline"
                        : "solar:align-vertical-center-linear"
                    }
                    width={26}
                  />
                </div>
                <div>
                  <p className="text-md font-bold">Execution Order</p>
                  <p>{action.exec_parallel ? "Parallel" : "Sequential"}</p>
                </div>
              </div>

              {/* Action Actions Amount */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:bolt-bold-duotone" width={26} />
                </div>
                <div>
                  <p className="text-md font-bold">Actions</p>
                  <p>{action.actions.length}</p>
                </div>
              </div>

              {/* Action Pattern Match Amount */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:clipboard-check-broken" width={26} />
                </div>
                <div>
                  <p className="text-md font-bold">Match Patterns</p>
                  <p>{action.match_patterns.length}</p>
                </div>
              </div>

              {/* Action Pattern Exclude Amount */}
              <div className="flex items-center gap-2">
                <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                  <Icon icon="solar:clipboard-remove-broken" width={26} />
                </div>
                <div>
                  <p className="text-md font-bold">Exclude Patterns</p>
                  <p>{action.exclude_patterns.length}</p>
                </div>
              </div>
            </div>
            <Divider className="my-4" />
            {/* Action Actions */}
            <p className="text-lg font-bold text-default-500 mb-2">Actions</p>
            <div className="flex flex-col gap-2">
              {action.actions.map((action: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                    <Icon
                      icon="solar:map-arrow-right-bold-duotone"
                      width={26}
                    />
                  </div>
                  <div>
                    <p className="text-md font-bold">{action}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Match Patterns */}
            <Spacer y={2} />
            <p className="text-lg font-bold text-success-500 mb-2">
              Match Patterns
            </p>
            {action.match_patterns.filter((pattern: any) => pattern.key)
              .length === 0 ? (
              <p>Actions will be triggered for all events.</p>
            ) : (
              <Table
                removeWrapper
                aria-label="Match Action Patterns"
                className="w-full"
              >
                <TableHeader>
                  <TableColumn>Key</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  {action.match_patterns.map((pattern: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{pattern.key}</TableCell>
                      <TableCell>{pattern.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Action Exclude Patterns */}
            <Spacer y={2} />
            <p className="text-lg font-bold text-danger-500 mb-2">
              Exclude Patterns
            </p>
            {action.exclude_patterns.filter((pattern: any) => pattern.key)
              .length === 0 ? (
              <p>Actions will be triggered for all events.</p>
            ) : (
              <Table
                removeWrapper
                aria-label="Exclude Action Patterns"
                className="w-full"
              >
                <TableHeader>
                  <TableColumn>Key</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  {action.exclude_patterns.map(
                    (pattern: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{pattern.key}</TableCell>
                        <TableCell>{pattern.value}</TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
