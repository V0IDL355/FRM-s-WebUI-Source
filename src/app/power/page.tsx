"use client";
import { DataTable } from "@/app/utils/table/data-table";
import { columns } from "./columns";
import React, { useEffect, useState } from "react";
import { api, fdelay } from "@/lib/api";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const chartConfig = {
  powercapacity: {
    label: "PowerCapacity",
    color: "#ca9ee6",
  },
  powerproduction: {
    label: "PowerProduction",
    color: "#e78284",
  },
  powerconsumed: {
    label: "PowerConsumed",
    color: "#ef9f76",
  },
  powermaxconsumed: {
    label: "PowerMaxConsumed",
    color: "#e5c890",
  },
} satisfies ChartConfig;

function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  return (
    <div
      ref={setNodeRef}
      className={"rounded gap-1 flex p-2 border"}
      style={
        isOver
          ? {
              backgroundColor: "hsla(220, 14%, 27%, 0.2)",
              borderColor: "hsl(220, 14%, 27%)",
            }
          : {}
      }
    >
      {props.children}
    </div>
  );
}

function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </Button>
  );
}

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

  const [items, setItems] = useState<{
    [key: string]: (string | number)[];
  }>({
    "priority-1": ["Hello", "World", "How", "Are"],
    "priority-2": [],
    "priority-3": [],
    "priority-4": [],
    "priority-5": [],
    "priority-6": [],
    "priority-7": [],
    "priority-8": [],
    undefined: [],
  });

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
              dataKey="PowerConsumed"
              type="monotone"
              stroke="var(--color-powerconsumed)"
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
      <Card className={"mt-[5px]"}>
        <CardContent className={"m-[24]"}>
          <DndContext
            onDragEnd={(event) => {
              const { active, over } = event;

              console.log(over);

              if (over) {
                console.table(items);
                setItems((prev) => {
                  const origin = Object.keys(prev).find((key) =>
                    prev[key as keyof typeof prev].includes(active.id),
                  ) as keyof typeof prev;

                  const destination = over.id as keyof typeof prev;

                  if (!origin || !destination || origin === destination)
                    return prev;

                  return {
                    ...prev,
                    [origin]: prev[origin].filter((item) => item !== active.id),
                    [destination]: [...prev[destination], active.id],
                  };
                });
              }
            }}
            modifiers={[restrictToWindowEdges]}
          >
            <div className={"flex w-full"}>
              <div className={"grid grid-rows-2 grid-cols-4 gap-1 flex-grow"}>
                {Object.entries(items)
                  .filter(([priority]) => priority !== "undefined")
                  .map(([priority, itemList]) => (
                    <Card key={priority}>
                      <CardHeader>
                        <CardTitle>
                          {priority
                            .replace("-", " ")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Droppable id={priority}>
                          {itemList.map((item) => (
                            <Draggable key={item} id={item}>
                              {item}
                            </Draggable>
                          ))}
                        </Droppable>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              <Card className={"ml-[5px]"}>
                <CardHeader>
                  <CardTitle>Undefined</CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable id={"undefined"}>
                    {items["undefined"] &&
                      items["undefined"].map((item) => (
                        <Draggable key={item} id={item}>
                          {item}
                        </Draggable>
                      ))}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
