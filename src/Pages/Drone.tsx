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
const droneRows: any[] = [];

function Drone() {
  const columns: GridColDef[] = [
    { field: "Name", headerName: "Name", width: 130 },
    { field: "PairedStation", headerName: "Paired Station", width: 130 },
    { field: "DroneStatus", headerName: "Drone Status", width: 130 },
    { field: "AvgTotalIncRate", headerName: "Avg Total Inc Rate", width: 150 },
    { field: "AvgTotalOutRate", headerName: "Avg Total Out Rate", width: 150 },
    { field: "EstBatteryRate", headerName: "Est Battery Rate", width: 150 },
  ];
  useSignalEffect(() => {
    const interval = setInterval(async () => {
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
      }
    }, fdelay.value);
    return () => {
      clearInterval(interval);
    };
  });
  for (const row of rows.value) {
    const id = uuidv5(
      String(
        row["location"]["x"] + row["location"]["y"] + row["location"]["z"],
      ),
      uuidv5.URL,
    );
    row.CustomID = id;
    if (!droneRows[id]) {
      droneRows[id] = [];
    }

    if (droneRows[id].length >= 10) {
      droneRows[id].shift();
    } else {
      droneRows[id].push(row);
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
