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
  prodpermin: {
    label: "ProdPerMin",
    color: "#ca9ee6",
  },
  conspercent: {
    label: "ConsPercent",
    color: "#e78284",
  },
  currentprod: {
    label: "CurrentProd",
    color: "#ef9f76",
  },
  maxprod: {
    label: "MaxProd",
    color: "#e5c890",
  },
  currentconsumed: {
    label: "CurrentConsumed",
    color: "#a6d189",
  },
  maxconsumed: {
    label: "MaxConsumed",
    color: "#81c8be",
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
        const data = (await api.get("/getProdStats")).data;
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
              dataKey="ProdPerMin"
              type="monotone"
              stroke="var(--color-prodpermin)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="ConsPercent"
              type="monotone"
              stroke="var(--color-conspercent)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="CurrentProd"
              type="monotone"
              stroke="var(--color-currentprod)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="MaxProd"
              type="monotone"
              stroke="var(--color-maxprod)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="CurrentConsumed"
              type="monotone"
              stroke="var(--color-currentconsumed)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="MaxConsumed"
              type="monotone"
              stroke="var(--color-maxconsumed)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
