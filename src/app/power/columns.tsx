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
    header: ({ column }) => makeHeader(column, "CircuitID"),
    cell: ({ row }) => makeCell(row, "CircuitID"),
  },
  {
    accessorKey: "PowerCapacity",
    header: ({ column }) => makeHeader(column, "PowerCapacity"),
    cell: ({ row }) => makeCell(row, "PowerCapacity"),
  },
  {
    accessorKey: "PowerProduction",
    header: ({ column }) => makeHeader(column, "PowerProduction"),
    cell: ({ row }) => makeCell(row, "PowerProduction"),
  },
  {
    accessorKey: "PowerConsumed",
    header: ({ column }) => makeHeader(column, "PowerConsumed"),
    cell: ({ row }) => makeCell(row, "PowerConsumed"),
  },
  {
    accessorKey: "PowerMaxConsumed",
    header: ({ column }) => makeHeader(column, "PowerMaxConsumed"),
    cell: ({ row }) => makeCell(row, "PowerMaxConsumed"),
  },
];
