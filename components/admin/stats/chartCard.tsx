"use client";

import React from "react";
import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartCard({
  name,
  interval,
  color,
  stats,
}: {
  name: string;
  interval: number;
  color: string;
  stats: any;
}) {
  const lastEntry = stats[stats.length - 1];

  return (
    <>
      {stats.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-col items-start px-4 pt-4">
            <p className="text-sm uppercase font-bold">{name}</p>
            <small className="text-default-500">
              Overview of the {name} within the last {interval} days
            </small>
            <h4 className="text-large font-bold">{lastEntry.value} today</h4>
          </CardHeader>
          <CardBody className="py-2">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={stats}>
                <XAxis hide dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{ background: "transparent", border: "none" }}
                />
                <Line
                  dataKey="value"
                  dot={false}
                  stroke={color}
                  strokeWidth={3}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      ) : (
        <Card className="space-y-5 p-4" radius="lg">
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300" />
          </Skeleton>
        </Card>
      )}
    </>
  );
}
