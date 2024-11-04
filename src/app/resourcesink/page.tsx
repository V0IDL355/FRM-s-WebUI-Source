"use client";

import { useSignalEffect } from "@preact/signals-react";
import { api, fdelay } from "@/lib/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Points",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function ResourceSink() {
  const [data, setData] = useState<any>([]);
  const [chartData, setChartData] = useState<any>([]);

  useSignalEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = (await api.get("/getResourceSink")).data[0];

        let tempArray = [];
        for (let i = 0; i < response["GraphPoints"].length; i++) {
          tempArray.push({
            points: response["GraphPoints"][i],
            index: i,
          });
        }
        setChartData(tempArray);
        setData(response);
      } catch {}
    }, fdelay);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div style={{ justifyItems: "center", display: "grid" }}>
      <Card
        style={{
          width: "25%",
          margin: "10px",
          minWidth: "200px",
          textAlign: "center",
        }}
      >
        <CardHeader>
          <CardTitle>You have: {data.NumCoupon ?? 0} coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={data.Percent ?? 0} />
        </CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="index" tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="points"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
