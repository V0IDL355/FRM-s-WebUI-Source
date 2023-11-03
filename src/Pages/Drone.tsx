/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { signal, useSignalEffect } from "@preact/signals-react";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";

const alert = signal({ error: false, message: "" });

const rows = signal([
  {
    Name: "Drone Port 1",
    ClassName: "Build_DroneStation_C",
    location: {
      x: -30655.7890625,
      y: 221870.6875,
      z: -40.6326904296875,
      rotation: 170,
    },
    PairedStation: "Drone Port 2",
    ConnectedStations: [{ StationName: "Drone Port 2" }],
    DroneStatus: "En Route",
    AvgIncRate: Math.round(0),
    AvgIncStack: Math.round(0),
    AvgOutRate: Math.round(0),
    AvgOutStack: Math.round(0),
    AvgRndTrip: "00:02:39",
    AvgTotalIncRate: Math.round(0),
    AvgTotalIncStack: Math.round(0),
    AvgTotalOutRate: Math.round(0),
    AvgTotalOutStack: Math.round(0),
    AvgTripIncAmt: Math.round(0),
    EstRndTrip: "00:01:50",
    EstTotalTransRate: Math.round(0),
    EstTransRate: Math.round(0),
    EstLatestTotalIncStack: Math.round(0),
    EstLatestTotalOutStack: Math.round(0),
    LatestIncStack: Math.round(0),
    LatestOutStack: Math.round(0),
    LatestRndTrip: "00:02:39",
    LatestTripIncAmt: Math.round(0),
    LatestTripOutAmt: Math.round(0),
    MedianRndTrip: "00:02:39",
    MedianTripIncAmt: Math.round(0),
    MedianTripOutAmt: Math.round(0),
    EstBatteryRate: Math.round(0),
    features: {
      properties: { name: "Drone Port", type: "Drone Station" },
      geometry: {
        coordinates: {
          X: -30655.7890625,
          Y: 221870.6875,
          Z: -40.6326904296875,
        },
        type: "Point",
      },
    },
  },
]);

const cell = signal({ id: 0 });

const droneRows: any[] = [];

function Drone() {
  const columns: GridColDef[] = [
    { field: "Name", headerName: "Name", width: 130 },
    { field: "PairedStation", headerName: "Paired Station", width: 130 },
    {
      field: "DroneStatus",
      headerName: "Drone Status",
      width: 130,
    },
    { field: "AvgTotalIncRate", headerName: "Avg Total Inc Rate", width: 150 },
    {
      field: "AvgTotalOutRate",
      headerName: "Avg Total Out Rate",
      width: 150,
    },
    {
      field: "EstBatteryRate",
      headerName: "Est Battery Rate",
      width: 150,
    },
  ];
  useSignalEffect(() => {
    const fetchData = async () => {
      try {
        const result: Array<any> = await api.get("/getDroneStation");
        result.forEach((data) => {
          data.AvgTotalIncRate = Math.round(data.AvgTotalIncRate);
          data.AvgTotalOutRate = Math.round(data.AvgTotalOutRate);
          data.EstBatteryRate = Math.round(data.EstBatteryRate);
        });
        rows.value = result;
        alert.value = { error: false, message: "" };
      } catch (error) {
        alert.value = {
          error: true,
          message: "Error fetching data. Please try again later.",
        };
        rows.value = [
          {
            Name: "Drone Port 1",
            ClassName: "Build_DroneStation_C",
            location: {
              x: -30655.7890625,
              y: 221870.6875,
              z: -40.6326904296875,
              rotation: 170,
            },
            PairedStation: "Drone Port 2",
            ConnectedStations: [{ StationName: "Drone Port 2" }],
            DroneStatus: "En Route",
            AvgIncRate: Math.round(Math.random() * 100),
            AvgIncStack: Math.round(Math.random() * 100),
            AvgOutRate: Math.round(Math.random() * 100),
            AvgOutStack: Math.round(Math.random() * 100),
            AvgRndTrip: "00:02:39",
            AvgTotalIncRate: Math.round(Math.random() * 100),
            AvgTotalIncStack: Math.round(Math.random() * 100),
            AvgTotalOutRate: Math.round(Math.random() * 100),
            AvgTotalOutStack: Math.round(Math.random() * 100),
            AvgTripIncAmt: Math.round(Math.random() * 100),
            EstRndTrip: "00:01:50",
            EstTotalTransRate: Math.round(Math.random() * 100),
            EstTransRate: Math.round(Math.random() * 100),
            EstLatestTotalIncStack: Math.round(Math.random() * 100),
            EstLatestTotalOutStack: Math.round(Math.random() * 100),
            LatestIncStack: Math.round(Math.random() * 100),
            LatestOutStack: Math.round(Math.random() * 100),
            LatestRndTrip: "00:02:39",
            LatestTripIncAmt: Math.round(Math.random() * 100),
            LatestTripOutAmt: Math.round(Math.random() * 100),
            MedianRndTrip: "00:02:39",
            MedianTripIncAmt: Math.round(Math.random() * 100),
            MedianTripOutAmt: Math.round(Math.random() * 100),
            EstBatteryRate: Math.round(Math.random() * 100),
            features: {
              properties: { name: "Drone Port", type: "Drone Station" },
              geometry: {
                coordinates: {
                  X: -30655.7890625,
                  Y: 221870.6875,
                  Z: -40.6326904296875,
                },
                type: "Point",
              },
            },
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
    const id = Math.round(
      row["location"]["x"] + row["location"]["y"] + row["location"]["z"]
    );
    const index = id;
    if (!droneRows[index]) {
      droneRows[index] = [];
    }

    if (droneRows[index].length >= 10) {
      droneRows[index].shift();
    } else {
      droneRows[index].push(row);
    }
  }

  const droneChart: any[] = [];
  if (droneRows[cell.value.id]) {
    for (const row of droneRows[cell.value.id]) {
      droneChart.push({
        AvgTotalIncRate: row["AvgTotalIncRate"],
        AvgTotalOutRate: row["AvgTotalOutRate"],
        EstBatteryRate: row["EstBatteryRate"],
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
          {alert.value.message}
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
        getRowId={(row) =>
          Math.round(
            row["location"]["x"] + row["location"]["y"] + row["location"]["z"]
          )
        }
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
            data={droneChart}
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
              dataKey="AvgTotalIncRate"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="AvgTotalOutRate"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Line
              connectNulls
              type="monotone"
              dataKey="EstBatteryRate"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default Drone;
