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
    accessorKey: "Recipe",
    header: ({ column }) => makeHeader(column, "Recipe"),
    cell: ({ row }) => makeCell(row, "Recipe"),
  },
  {
    accessorKey: "ManuSpeed",
    header: ({ column }) => makeHeader(column, "Manu Speed (%)"),
    cell: ({ row }) => makeCell(row, "ManuSpeed"),
  },
  {
    accessorKey: "IsProducing",
    header: ({ column }) => makeHeader(column, "Is Producing"),
    cell: ({ row }) => makeCell(row, "IsProducing"),
  },
  {
    accessorKey: "IsPaused",
    header: ({ column }) => makeHeader(column, "Is Paused"),
    cell: ({ row }) => makeCell(row, "IsPaused"),
  },
];
