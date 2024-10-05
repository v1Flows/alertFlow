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
  BarChart,
  Bar,
} from "recharts";
import { Icon } from "@iconify/react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        color: "#333",
      }}>
        <p>{payload[0].value} <span className="text-default-500">Executions</span></p>
        <p className="text-sm text-default-500">{label}</p>
      </div>
    );
  }

  return null;
};

export default function ExecutionChartCard({ stats }: { stats: any }) {
  const lastExecution = stats.executions[stats.executions.length - 1];

  return (
    <Card>
      <CardBody>
        <div className="grid grid-cols-2 items-center justify-between">
          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                <Icon icon="solar:rocket-2-broken" width={20} />
              </div>
              <div>
                <h4 className="text-large font-bold">{lastExecution.value}</h4>
                <p className="text-sm">Executions today</p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div style={{ height: '80px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.executions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide={true} />
                  <YAxis hide={true} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }} />
                  <Bar dataKey="count" fill="rgba(211, 211, 211, 0.6)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
