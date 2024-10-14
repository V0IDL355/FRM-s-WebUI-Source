"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PlugZap, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { makeCell, makeHeader } from "@/app/utils/table/column";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "FuseTriggered",
    header: ({ column }) => makeHeader(column, "FuseTriggered"),
    cell: ({ row }) => {
      const fuseTriggered: boolean = row.getValue("FuseTriggered");
      return (
        <Button variant="outline" style={{ width: "100%" }}>
          {fuseTriggered ? (
            <Unplug className="h-4 w-4" />
          ) : (
            <PlugZap className="h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "CircuitID",
    header: ({ column }) => makeHeader(column, "Circuit ID"),
    cell: ({ row }) => makeCell(row, "CircuitID"),
  },
  {
    accessorKey: "PowerCapacity",
    header: ({ column }) => makeHeader(column, "Power Capacity (MW)"),
    cell: ({ row }) => makeCell(row, "PowerCapacity"),
  },
  {
    accessorKey: "PowerProduction",
    header: ({ column }) => makeHeader(column, "Power Production (MW)"),
    cell: ({ row }) => makeCell(row, "PowerProduction"),
  },
  {
    accessorKey: "PowerConsumed",
    header: ({ column }) => makeHeader(column, "Power Consumed (MW)"),
    cell: ({ row }) => makeCell(row, "PowerConsumed"),
  },
  {
    accessorKey: "PowerMaxConsumed",
    header: ({ column }) => makeHeader(column, "Power Max Consumed (MW)"),
    cell: ({ row }) => makeCell(row, "PowerMaxConsumed"),
  },
  {
    accessorKey: "BatteryDifferential",
    header: ({ column }) => makeHeader(column, "Battery Differential(MW) "),
    cell: ({ row }) => makeCell(row, "BatteryDifferential"),
  },
  {
    accessorKey: "BatteryPercent",
    header: ({ column }) => makeHeader(column, "Battery Percent (%)"),
    cell: ({ row }) => makeCell(row, "BatteryPercent"),
  },
  {
    accessorKey: "BatteryCapacity",
    header: ({ column }) => makeHeader(column, "Battery Capacity"),
    cell: ({ row }) => makeCell(row, "BatteryCapacity"),
  },
  {
    accessorKey: "BatteryTimeEmpty",
    header: ({ column }) => makeHeader(column, "Battery Time Empty"),
    cell: ({ row }) => makeCell(row, "BatteryTimeEmpty"),
  },
  {
    accessorKey: "BatteryTimeFull",
    header: ({ column }) => makeHeader(column, "Battery Time Full"),
    cell: ({ row }) => makeCell(row, "BatteryTimeFull"),
  },
];
