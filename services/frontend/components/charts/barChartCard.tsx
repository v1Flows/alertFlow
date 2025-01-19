"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function BarChartCard({
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
      {stats.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col items-start px-4 pt-4">
            <p className="text-sm font-bold uppercase">{name}</p>
            <small className="text-default-500">
              Overview of the {name} within the last {interval} days
            </small>
            <h4 className="text-large font-bold">{lastEntry.value} today</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <ResponsiveContainer height={70} width="100%">
              <BarChart data={stats}>
                <XAxis hide dataKey="date" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "transparent", border: "none" }}
                />
                <Bar dataKey="value" fill={color} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}
    </>
  );
}
