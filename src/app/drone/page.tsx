"use client";
import { DataTable } from "@/app/utils/table/data-table";
import { columns } from "./columns";
import React, { useEffect, useState } from "react";
import { api, fdelay } from "@/app/utils/api";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

const chartConfig = {
  avgtotalincrate: {
    label: "AvgTotalIncRate",
    color: "#ca9ee6",
  },
  avgtotaloutrate: {
    label: "AvgTotalOutRate",
    color: "#e78284",
  },
} satisfies ChartConfig;

export default function OverallProd() {
  const [data, setData] = useState<any>([]);

  const [rowSelection, setRowSelection] = React.useState<any>({});
  const selectedRowIds: string[] = Object.keys(rowSelection).filter(
    (id: string) => rowSelection[id],
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = (await api.get("/getDroneStation")).data;
        setData(data);
      } catch {}
    }, fdelay);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [lastSelectedRows, setLastSelectedRows] = useState<any[]>([]);

  useEffect(() => {
    if (selectedRowIds.length > 0) {
      const latestSelectedRowId = selectedRowIds[0];
      const latestRowData = data[parseInt(latestSelectedRowId, 10)];

      if (latestRowData) {
        setLastSelectedRows((prev) => {
          const updatedRows = [...prev, latestRowData];
          return updatedRows.slice(-10);
        });
      }
    }
  }, [data]);

  return (
    <div style={{ margin: 5, padding: 25 }}>
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      <Card
        style={{
          width: "100%",
          textAlign: "center",
          marginTop: 5,
        }}
      >
        <ChartContainer
          style={{
            height: "20vh",
            width: "100%",
            padding: 10,
            justifyContent: "center",
          }}
          config={chartConfig}
        >
          <LineChart accessibilityLayer data={lastSelectedRows}>
            <CartesianGrid vertical={false} />
            <XAxis />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
            <Line
              dataKey="AvgTotalIncRate"
              type="monotone"
              stroke="var(--color-avgtotalincrate)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="AvgTotalOutRate"
              type="monotone"
              stroke="var(--color-avgtotaloutrate)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
