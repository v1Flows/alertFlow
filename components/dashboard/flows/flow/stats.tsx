"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import ChartCard from "@/components/charts/chartCard";
import GetFlowStats from "@/lib/fetch/flow/stats";

export default function FlowStats({ flowID }: any) {
  const [interval] = useState(7);
  const [stats, setStats] = useState({
    started_execution_stats: [],
    failed_execution_stats: [],
    incoming_payloads_stats: [],
  });

  async function getStats() {
    const stats = await GetFlowStats(flowID, interval);

    if (stats.error) {
      toast.error(stats.error);
    }
    setStats(stats);
  }

  useEffect(() => {
    getStats();
  }, [interval]);

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        showTotal
        color="#006fed"
        interval={interval}
        name="Incoming Payloads"
        stats={stats.incoming_payloads_stats}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          showTotal
          color="#006fed"
          interval={interval}
          name="Started Executions"
          stats={stats.started_execution_stats}
        />
        <ChartCard
          showTotal
          color="#f31260"
          interval={interval}
          name="Failed Executions"
          stats={stats.failed_execution_stats}
        />
      </div>
    </div>
  );
}
