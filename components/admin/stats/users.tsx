import { Icon } from "@iconify/react";
import {
  Card,
  CardBody,
  CircularProgress,
  Skeleton,
  Spacer,
} from "@nextui-org/react";

import ChartCard from "../../charts/chartCard";

export default function UsersStats({
  users,
  stats,
  interval,
}: {
  users: any;
  stats: any;
  interval: number;
}) {
  return (
    <div>
      <p className="text-xl font-bold">Users</p>
      <Spacer y={1} />
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex bg-primary/10 text-primary items-center rounded-small justify-center w-10 h-10">
                <Icon icon="solar:book-bookmark-broken" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">{users.length}</p>
                <p className="text-sm text-default-500">Total Users</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2">
              <div className="flex bg-danger/10 text-danger items-center rounded-small justify-center w-10 h-10">
                <Icon icon="solar:book-bookmark-broken" width={26} />
              </div>
              <div>
                <p className="text-md font-bold">
                  {users.filter((p: any) => p.disabled).length}
                </p>
                <p className="text-sm text-default-500">Disabled Users</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Spacer y={2} />
      <div className="grid lg:grid-cols-3 gap-4">
        <ChartCard
          color="#006fed"
          interval={interval}
          name="user registrations"
          stats={stats.user_registration_stats}
        />
        <Card>
          <CardBody>
            <p className="font-bold">Amount of Users per Plan</p>
            <Spacer y={1} />
            <div className="grid lg:grid-cols-2 gap-2">
              {stats.users_per_plan_stats.length === 0 && (
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
              )}
              {stats.users_per_plan_stats.map((p: any) => (
                <div key={p.plan}>
                  <div className="flex items-center gap-2">
                    <CircularProgress
                      aria-label="Loading..."
                      color="primary"
                      maxValue={users.length}
                      showValueLabel={true}
                      size="lg"
                      value={p.count}
                    />
                    <div>
                      <p className="text-md font-bold">{p.count}</p>
                      <p className="text-sm text-default-500">{p.plan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="font-bold">Amount of Users per Role</p>
            <Spacer y={1} />
            <div className="flex flex-col gap-2">
              {stats.users_per_role_stats.length === 0 && (
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
              )}
              {stats.users_per_role_stats.map((p: any) => (
                <div key={p.role}>
                  <div className="flex items-center gap-2">
                    <CircularProgress
                      aria-label="Loading..."
                      color={
                        p.role === "Admin"
                          ? "danger"
                          : p.role === "VIP"
                            ? "warning"
                            : "primary"
                      }
                      maxValue={users.length}
                      showValueLabel={true}
                      size="lg"
                      value={p.count}
                    />
                    <div>
                      <p className="text-md font-bold">{p.count}</p>
                      <p className="text-sm text-default-500">{p.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
