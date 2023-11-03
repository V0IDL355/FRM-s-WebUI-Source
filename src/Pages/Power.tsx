/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponsiveContainer,
  LineChart,
  Tooltip,
  CartesianGrid,
  YAxis,
  Legend,
  Line,
} from "recharts";
import tooltip from "../Utils/tooltip";
import pageOptions from "../Utils/page";
import api from "../Utils/api";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { signal, useSignalEffect } from "@preact/signals-react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
const alert = signal({ error: false, message: "" });
const rows = signal([
  {
    CircuitID: 58,
    PowerCapacity: Math.round(0),
    PowerProduction: Math.round(0),
    PowerConsumed: Math.round(0),
    PowerMaxConsumed: Math.round(0),
    BatteryDifferential: 0,
    BatteryPercent: 100,
    BatteryCapacity: 2500,
    BatteryTimeEmpty: "00:00:00",
    BatteryTimeFull: "00:00:00",
    FuseTriggered: false,
  },
  {
    CircuitID: 9,
    PowerCapacity: Math.round(0),
    PowerProduction: Math.round(0),
    PowerConsumed: Math.round(0),
    PowerMaxConsumed: Math.round(0),
    BatteryDifferential: 0,
    BatteryPercent: 100,
    BatteryCapacity: 2500,
    BatteryTimeEmpty: "00:00:00",
    BatteryTimeFull: "00:00:00",
    FuseTriggered: false,
  },
]);
const cell = signal({ id: 0 });

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
    const fetchData = async () => {
      try {
        const result: Array<any> = await api.get("/getPower");
        result.forEach((data) => {
          data.PowerCapacity = Math.round(data.PowerCapacity);
          data.PowerProduction = Math.round(data.PowerProduction);
          data.PowerConsumed = Math.round(data.PowerConsumed);
          data.PowerMaxConsumed = Math.round(data.PowerMaxConsumed);
          data.BatteryDifferential = Math.round(data.BatteryDifferential);
          data.BatteryCapacity = Math.round(data.BatteryCapacity);
        });
        rows.value = result;
        alert.value = { error: false, message: "" };
      } catch (error) {
        alert.value = {
          error: false,
          message: "Error fetching data. Please try again later.",
        };
        rows.value = [
          {
            CircuitID: 58,
            PowerCapacity: Math.round(Math.random() * 100),
            PowerProduction: Math.round(Math.random() * 100),
            PowerConsumed: Math.round(Math.random() * 100),
            PowerMaxConsumed: Math.round(Math.random() * 100),
            BatteryDifferential: 0,
            BatteryPercent: 100,
            BatteryCapacity: 2500,
            BatteryTimeEmpty: "00:00:00",
            BatteryTimeFull: "00:00:00",
            FuseTriggered: false,
          },
          {
            CircuitID: 9,
            PowerCapacity: Math.round(Math.random() * 100),
            PowerProduction: Math.round(Math.random() * 100),
            PowerConsumed: Math.round(Math.random() * 100),
            PowerMaxConsumed: Math.round(Math.random() * 100),
            BatteryDifferential: 0,
            BatteryPercent: 100,
            BatteryCapacity: 2500,
            BatteryTimeEmpty: "00:00:00",
            BatteryTimeFull: "00:00:00",
            FuseTriggered: false,
          },
        ];
      }
    };

    const fspeedString = localStorage.getItem("fspeed");
    const delay = fspeedString ? parseInt(fspeedString) : 1000;

    const interval = setInterval(() => {
      fetchData();
    }, delay);
    return () => {
      clearInterval(interval);
    };
  });

  for (const row of rows.value) {
    if (!powerRows[row["CircuitID"]]) {
      powerRows[row["CircuitID"]] = [];
    }

    if (powerRows[row["CircuitID"]].length >= 10) {
      powerRows[row["CircuitID"]].shift();
    } else {
      powerRows[row["CircuitID"]].push(row);
    }
  }

  const powerChart: any[] = [];

  for (let v = 0; v < powerRows.length; v++) {
    if (powerRows[v]) {
      for (let i = 0; i < powerRows[v].length; i++) {
        if (powerRows[v][i]["CircuitID"] === cell.value.id) {
          powerChart.push({
            CircuitID: powerRows[v][i].CircuitID,
            PowerCapacity: powerRows[v][i].PowerCapacity,
            PowerProduction: powerRows[v][i].PowerProduction,
            PowerConsumed: powerRows[v][i].PowerConsumed,
            PowerMaxConsumed: powerRows[v][i].PowerMaxConsumed,
          });
        }
      }
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
        getRowId={(row) => row.CircuitID}
        pageSizeOptions={pageOptions()}
        onCellClick={(v) => (cell.value.id = Number(v.id))}
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
