/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, Snackbar } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  YAxis,
  Legend,
  Line,
  Tooltip,
} from "recharts";
import tooltip from "../Utils/tooltip";
import pageOptions from "../Utils/page";
import api from "../Utils/api";

const overallProdRows: any[] = [];
function OverallProd() {
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState([
    {
      Name: "Alclad Aluminum Sheet",
      ClassName: "Desc_AluminumPlate_C",
      ProdPerMin: "P:0.0/min - C: 0.0/min",
      ProdPercent: 0,
      ConsPercent: 0,
      CurrentProd: 0,
      MaxProd: 0,
      CurrentConsumed: 0,
      MaxConsumed: 89.999992370605469,
      Type: "Belt",
    },
    {
      Name: "Alumina Solution",
      ClassName: "Desc_AluminaSolution_C",
      ProdPerMin: "P:0.0/min - C: 0.0/min",
      ProdPercent: 0,
      ConsPercent: 0,
      CurrentProd: 0,
      MaxProd: 0,
      CurrentConsumed: 0,
      MaxConsumed: 660,
      Type: "Pipe",
    },
    {
      Name: "Aluminum Casing",
      ClassName: "Desc_AluminumCasing_C",
      ProdPerMin: "P:0.0/min - C: 0.0/min",
      ProdPercent: 0,
      ConsPercent: 0,
      CurrentProd: 0,
      MaxProd: 0,
      CurrentConsumed: 0,
      MaxConsumed: 180,
      Type: "Belt",
    },
  ]);
  const [cell, setCell] = React.useState(null as any);
  const columns: GridColDef[] = [
    { field: "Name", headerName: "Name", width: 200 },
    { field: "ProdPerMin", headerName: "Prod Per Min", width: 250 },
    { field: "ConsPercent", headerName: "Cons Percent (%)", width: 130 },
    {
      field: "ProdPercent",
      headerName: "Prod Percent (%)",
      width: 130,
    },
    {
      field: "CurrentProd",
      headerName: "Current Prod",
      width: 130,
    },
    {
      field: "MaxProd",
      headerName: "Max Prod",
      width: 150,
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result: Array<any> = await api.get("/getProdStats");
        result.forEach((data) => {
          data.ProdPercent = Math.round(data.ProdPercent);
          data.ConsPercent = Math.round(data.ConsPercent);
          data.CurrentProd = Math.round(data.CurrentProd);
          data.MaxProd = Math.round(data.MaxProd);
        });
        setRows(result);
        setError(null);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        setRows([
          {
            Name: "Alclad Aluminum Sheet",
            ClassName: "Desc_AluminumPlate_C",
            ProdPerMin: "P:0.0/min - C: 0.0/min",
            ProdPercent: Math.round(Math.random() * 100),
            ConsPercent: Math.round(Math.random() * 100),
            CurrentProd: Math.round(Math.random() * 100),
            MaxProd: Math.round(Math.random() * 100),
            CurrentConsumed: 0,
            MaxConsumed: 89.999992370605469,
            Type: "Belt",
          },
          {
            Name: "Alumina Solution",
            ClassName: "Desc_AluminaSolution_C",
            ProdPerMin: "P:0.0/min - C: 0.0/min",
            ProdPercent: Math.round(Math.random() * 100),
            ConsPercent: Math.round(Math.random() * 100),
            CurrentProd: Math.round(Math.random() * 100),
            MaxProd: Math.round(Math.random() * 100),
            CurrentConsumed: 0,
            MaxConsumed: 660,
            Type: "Pipe",
          },
          {
            Name: "Aluminum Casing",
            ClassName: "Desc_AluminumCasing_C",
            ProdPerMin: "P:0.0/min - C: 0.0/min",
            ProdPercent: Math.round(Math.random() * 100),
            ConsPercent: Math.round(Math.random() * 100),
            CurrentProd: Math.round(Math.random() * 100),
            MaxProd: Math.round(Math.random() * 100),
            CurrentConsumed: 0,
            MaxConsumed: 180,
            Type: "Belt",
          },
        ]);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  for (const row of rows) {
    if (!overallProdRows[row["Name"]]) {
      overallProdRows[row["Name"]] = [];
    }

    if (overallProdRows[row["Name"]].length >= 10) {
      overallProdRows[row["Name"]].shift();
    } else {
      overallProdRows[row["Name"]].push(row);
    }
  }

  const overallProdChart: any[] = [];

  if (overallProdRows[cell?.id]) {
    for (const row of overallProdRows[cell?.id]) {
      overallProdChart.push({
        MaxProd: row["MaxProd"],
        CurrentProd: row["CurrentProd"],
        ProdPercent: row["ProdPercent"],
        ConsPercent: row["ConsPercent"],
      });
    }
  }

  return (
    <Box>
      <Snackbar open={!!error}>
        <Alert
          severity="error"
          sx={{
            width: "50%",
            position: "fixed",
            bottom: "10%",
            left: "25%",
          }}
          variant="filled"
        >
          Using test data! This means that while getting the data there was an
          error!
        </Alert>
      </Snackbar>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        getRowId={(row) => row.Name}
        pageSizeOptions={pageOptions()}
        onCellClick={setCell}
      />
      <Box
        sx={{
          height: "50vh",
          width: "100%",
          position: "relative",
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={overallProdChart}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis />
            <Tooltip content={tooltip} />
            <Legend layout="horizontal" />

            <Line
              connectNulls
              type="monotone"
              dataKey="CurrentProd"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="MaxProd"
              stroke="#ff99cc"
              fill="#ff99cc"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="ProdPercent"
              stroke="#41fca3"
              fill="#41fca3"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="ConsPercent"
              stroke="#cf2a47"
              fill="#cf2a47"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default OverallProd;
