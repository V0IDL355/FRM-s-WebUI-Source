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
    accessorKey: "ProdPerMin",
    header: ({ column }) => makeHeader(column, "Prod Per Min"),
    cell: ({ row }) => makeCell(row, "ProdPerMin"),
  },
  {
    accessorKey: "ConsPercent",
    header: ({ column }) => makeHeader(column, "Cons Percent"),
    cell: ({ row }) => makeCell(row, "ConsPercent"),
  },
  {
    accessorKey: "CurrentProd",
    header: ({ column }) => makeHeader(column, "Current Prod"),
    cell: ({ row }) => makeCell(row, "CurrentProd"),
  },
  {
    accessorKey: "MaxProd",
    header: ({ column }) => makeHeader(column, "Max Prod"),
    cell: ({ row }) => makeCell(row, "MaxProd"),
  },

  {
    accessorKey: "CurrentConsumed",
    header: ({ column }) => makeHeader(column, "Current Consumed"),
    cell: ({ row }) => makeCell(row, "CurrentConsumed"),
  },
  {
    accessorKey: "MaxConsumed",
    header: ({ column }) => makeHeader(column, "Max Consumed"),
    cell: ({ row }) => makeCell(row, "MaxConsumed"),
  },
];
