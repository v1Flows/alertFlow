"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          color: "#333",
        }}
      >
        <p className="text-sm">
          {payload[0].value} <span className="text-default-500">Payloads</span>
        </p>
        <p className="text-xs text-default-500">{label}</p>
      </div>
    );
  }

  return null;
};

export default function PayloadChartCard({ stats }: { stats: any }) {
  const lastPayload = stats.payloads[stats.payloads.length - 1];
  const { theme } = useTheme();

  function barsColor() {
    return theme === "dark" ? "#3F3F46" : "#D4D4D8";
  }

  return (
    <Card>
      <CardBody>
        <div className="grid grid-cols-2 items-center justify-between">
          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex bg-default/30 text-foreground items-center rounded-small justify-center w-10 h-10">
                <Icon icon="solar:letter-opened-outline" width={20} />
              </div>
              <div>
                <h4 className="text-large font-bold">{lastPayload.value}</h4>
                <p className="text-sm text-default-500">Payloads today</p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            {stats.payloads.filter((p: any) => p.value > 0).length > 0 ? (
              <div style={{ height: "50px" }}>
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart
                    data={stats.payloads}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" hide={true} />
                    <YAxis hide={true} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(136, 132, 216, 0.2)" }}
                    />
                    <Bar
                      dataKey="value"
                      fill={barsColor()}
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-default-400">
                No payloads found for the last 7 days.
              </p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
