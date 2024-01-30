/* eslint-disable @typescript-eslint/no-explicit-any */
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import {DataGrid} from "@mui/x-data-grid/DataGrid/DataGrid";
import {GridColDef} from "@mui/x-data-grid/models/colDef/gridColDef";
import {signal, useSignalEffect} from "@preact/signals-react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, YAxis,} from "recharts";
import {v5 as uuidv5} from "uuid";
import {api, fdelay} from "../Utils/api";
import tooltip from "../Utils/tooltip";
import {pageOptions} from "../Utils/utils";

const alert = signal({ error: false, message: "" });
const rows = signal<any>([]);
const cell = signal({ id: "" });
const powerRows: any[] = [];

function Power() {
  const columns: GridColDef[] = [
    { field: "CircuitID", headerName: "Circuit ID", width: 80 },
    { field: "PowerCapacity", headerName: "Power Capacity (MW)", width: 150 },
    {
      field: "PowerProduction",
      headerName: "Power Production (MW)",
      width: 180,
    },
    {
      field: "PowerConsumed",
      headerName: "Power Consumed (MW)",
      width: 180,
    },
    {
      field: "PowerMaxConsumed",
      headerName: "Max Consumed (MW)",
      width: 180,
    },
    {
      field: "BatteryDifferential",
      headerName: "Battery Differential (MW)",
      width: 180,
    },
    { field: "BatteryPercent", headerName: "Battery Percent (%)", width: 150 },
    { field: "BatteryCapacity", headerName: "Battery Capacity", width: 150 },
    {
      field: "BatteryTimeEmpty",
      headerName: "Time Till Battery Empty",
      width: 180,
    },
    {
      field: "BatteryTimeFull",
      headerName: "Time Till Battery Full",
      width: 150,
    },
    {
      field: "FuseTriggered",
      headerName: "Fuse Triggered",
      width: 150,
    },
  ];

  useSignalEffect(() => {
    const interval = setInterval(async () => {
      try {
        const result: Array<any> = await api.get("/getPower");
        result.forEach((data) => {
          data.PowerCapacity = Math.round(data.PowerCapacity);
          data.PowerProduction = Math.round(data.PowerProduction);
          data.PowerConsumed = Math.round(data.PowerConsumed);
          data.PowerMaxConsumed = Math.round(data.PowerMaxConsumed);
          data.BatteryDifferential = Math.round(data.BatteryDifferential);
          data.BatteryCapacity = Math.round(data.BatteryCapacity);
          data.BatteryPercent = Math.round(data.BatteryPercent);
        });
        rows.value = result;
        alert.value = { error: false, message: "" };
      } catch (error) {
        alert.value = {
          error: false,
          message: "Error fetching data. Please try again later.",
        };
      }
    }, fdelay.value);
    return () => {
      clearInterval(interval);
    };
  });

  for (const row of rows.value) {
    const id = uuidv5(String(row["CircuitID"]), uuidv5.URL);
    row.CustomID = id;
    if (!powerRows[id]) {
      powerRows[id] = [];
    }

    if (powerRows[id].length >= 10) {
      powerRows[id].shift();
    } else {
      powerRows[id].push(row);
    }
  }

  const powerChart: any[] = [];
  if (powerRows[cell.value.id]) {
    for (const row of powerRows[cell.value.id]) {
      powerChart.push({
        CircuitID: row.CircuitID,
        PowerCapacity: row.PowerCapacity,
        PowerProduction: row.PowerProduction,
        PowerConsumed: row.PowerConsumed,
        PowerMaxConsumed: row.PowerMaxConsumed,
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
            data={powerChart}
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
              dataKey="PowerCapacity"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="PowerProduction"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="PowerConsumed"
              stroke="#ffc658"
              fill="#ffc658"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="PowerMaxConsumed"
              stroke="#ff485b"
              fill="#ff485b"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default Power;
