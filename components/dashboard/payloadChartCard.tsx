"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PayloadChartCard({ stats }: { stats: any }) {
  const lastPayload = stats.payloads[stats.payloads.length - 1];

  return (
    <Card>
      <CardHeader className="flex flex-col items-start px-4 pt-4">
        <p className="text-sm uppercase font-bold">Daily Payloads</p>
        <small className="text-default-500">
          Overview of the daily incoming payloads within the last 7 days
        </small>
        <h4 className="text-large font-bold">{lastPayload.value} today</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <ResponsiveContainer height={70} width="100%">
          <LineChart data={stats.payloads}>
            <XAxis hide dataKey="date" />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "transparent", border: "none" }}
            />
            <Line
              dataKey="value"
              dot={false}
              stroke="#006fed"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
