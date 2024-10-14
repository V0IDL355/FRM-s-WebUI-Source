"use client";

import { ColumnDef } from "@tanstack/react-table";
import { makeCell, makeHeader } from "@/app/utils/table/column";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "Name",
    header: ({ column }) => makeHeader(column, "Name"),
    cell: ({ row }) => makeCell(row, "Name"),
  },
  {
    accessorKey: "PairedStation",
    header: ({ column }) => makeHeader(column, "Paired Station"),
    cell: ({ row }) => makeCell(row, "PairedStation"),
  },
  {
    accessorKey: "DroneStatus",
    header: ({ column }) => makeHeader(column, "DroneStatus"),
    cell: ({ row }) => makeCell(row, "DroneStatus"),
  },
  {
    accessorKey: "AvgTotalIncRate",
    header: ({ column }) => makeHeader(column, "Avg Total Inc Rate"),
    cell: ({ row }) => makeCell(row, "AvgTotalIncRate"),
  },
  {
    accessorKey: "AvgTotalOutRate",
    header: ({ column }) => makeHeader(column, "Avg Total Out Rate"),
    cell: ({ row }) => makeCell(row, "AvgTotalOutRate"),
  },
];
