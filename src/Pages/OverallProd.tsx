/* eslint-disable @typescript-eslint/no-explicit-any */
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { signal, useSignalEffect } from "@preact/signals-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { v5 as uuidv5 } from "uuid";
import { api, fdelay } from "../Utils/api";
import tooltip from "../Utils/tooltip";
import { pageOptions } from "../Utils/utils";
const alert = signal({ error: false, message: "" });
const rows = signal<any>([]);
const cell = signal({ id: "" });

const overallProdRows: any[] = [];
function OverallProd() {
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

  useSignalEffect(() => {
    const fetchData = async () => {
      try {
        const result: Array<any> = await api.get("/getProdStats");
        result.forEach((data) => {
          const prodPerMin = (data.ProdPerMin.match(/\d+\.\d+/g) || []).map(
            (data) => Math.round(parseInt(data))
          );
          data.ProdPerMin = `P:${prodPerMin[0]}/min | C:${prodPerMin[1]}/min`;
          data.ProdPercent = Math.round(data.ProdPercent);
          data.ConsPercent = Math.round(data.ConsPercent);
          data.CurrentProd = Math.round(data.CurrentProd);
          data.MaxProd = Math.round(data.MaxProd);
        });
        rows.value = result;
        alert.value = { error: false, message: "" };
      } catch (error) {
        alert.value = {
          error: false,
          message: "Error fetching data. Please try again later.",
        };
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, fdelay.value);
    return () => {
      clearInterval(interval);
    };
  });

  for (const row of rows.value) {
    const id = uuidv5(row["Name"] + row["ClassName"] + row["Type"], uuidv5.URL);
    row.CustomID = id;
    if (!overallProdRows[id]) {
      overallProdRows[id] = [];
    }

    if (overallProdRows[id].length >= 10) {
      overallProdRows[id].shift();
    } else {
      overallProdRows[id].push(row);
    }
  }

  const overallProdChart: any[] = [];
  if (overallProdRows[cell.value.id]) {
    for (const row of overallProdRows[cell.value.id]) {
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
      <Snackbar open={alert.value.error}>
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
        rows={rows.value}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        getRowId={(row) => row.CustomID}
        pageSizeOptions={pageOptions()}
        onCellClick={(v) => (cell.value.id = String(v.id))}
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
