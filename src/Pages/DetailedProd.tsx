/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { signal, useSignalEffect } from "@preact/signals-react";

import api from "../Utils/api";
import pageOptions from "../Utils/page";
import tooltip from "../Utils/tooltip";

const alert = signal({ error: false, message: "" });

const rows = signal<any>([]);
const cell = signal({ id: 0 });

const detailProdRows: any[] = [];
function DetailedProd() {
  const columns: GridColDef[] = [
    { field: "Name", headerName: "Name", width: 150 },
    { field: "Recipe", headerName: "Recipe", width: 150 },
    { field: "ManuSpeed", headerName: "Manu Speed", width: 130 },
    {
      field: "IsProducing",
      headerName: "Is Producing",
      width: 130,
    },
    {
      field: "IsPaused",
      headerName: "Is Paused",
      width: 130,
    },
  ];

  useSignalEffect(() => {
    const fetchData = async () => {
      try {
        const result: Array<any> = await api.get("/getFactory");
        result.forEach((data) => {
          data.ManuSpeed = Math.round(data.ManuSpeed);
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
    const id = Math.round(row.location.x + row.location.y + row.location.z);
    const index = id;
    if (!detailProdRows[index]) {
      detailProdRows[index] = [];
    }

    if (detailProdRows[index].length >= 10) {
      detailProdRows[index].shift();
    } else {
      detailProdRows[index].push(row);
    }
  }

  const detailProdChart: any[] = [];
  if (detailProdRows[cell.value.id]) {
    for (const row of detailProdRows[cell.value.id]) {
      detailProdChart.push({
        ManuSpeed: row.ManuSpeed,
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
            data={detailProdChart}
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
              dataKey="ManuSpeed"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default DetailedProd;
