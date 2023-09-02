/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, Snackbar } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import React from "react";
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

const powerRows: any[] = [];
function Power() {
  const [error, setError] = React.useState<string | null>(null);
  const [cell, setCell] = React.useState(null as any);
  const [rows, setRows] = React.useState([
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

  React.useEffect(() => {
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
        setRows(result);
        setError(null);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        setRows([
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
        ]);
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
  }, []);

  for (const row of rows) {
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
        if (powerRows[v][i]["CircuitID"] === cell?.id) {
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
        getRowId={(row) => row.CircuitID}
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
