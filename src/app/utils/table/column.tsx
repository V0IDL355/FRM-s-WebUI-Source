import { Button } from "@/components/ui/button";
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";

export const makeHeader = (column: any, text: string) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    style={{ width: "100%" }}
  >
    {text}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const makeCell = (row: any, accessorKey: string) => (
  <p
    style={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {typeof row.getValue(accessorKey) === "number" ? (
      Math.round(row.getValue(accessorKey))
    ) : typeof row.getValue(accessorKey) === "boolean" ? (
      row.getValue(accessorKey) === true ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )
    ) : (
      row.getValue(accessorKey).toString()
    )}
  </p>
);
