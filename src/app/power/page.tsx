"use client";
import { DataTable } from "@/app/utils/table/data-table";
import { columns } from "./columns";
import React, { useEffect, useState } from "react";
import { api, fdelay } from "@/app/utils/api";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";

const chartConfig = {
  powercapacity: {
    label: "PowerCapacity",
    color: "#ca9ee6",
  },
  powerproduction: {
    label: "PowerProduction",
    color: "#e78284",
  },
  powermaxconsumed: {
    label: "PowerMaxConsumed",
    color: "#ef9f76",
  },
} satisfies ChartConfig;

export default function Power() {
  const [data, setData] = useState<any>([]);

  const [rowSelection, setRowSelection] = React.useState<any>({});
  const selectedRowIds: string[] = Object.keys(rowSelection).filter(
    (id: string) => rowSelection[id],
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = (await api.get("/getPower")).data;
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
              dataKey="PowerCapacity"
              type="monotone"
              stroke="var(--color-powercapacity)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="PowerProduction"
              type="monotone"
              stroke="var(--color-powerproduction)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="PowerMaxConsumed"
              type="monotone"
              stroke="var(--color-powermaxconsumed)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
