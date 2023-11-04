/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, YAxis
} from 'recharts';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid/DataGrid/DataGrid';
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import { signal, useSignalEffect } from '@preact/signals-react';

import api from '../Utils/api';
import pageOptions from '../Utils/page';
import tooltip from '../Utils/tooltip';

const alert = signal({ error: false, message: "" });
const rows = signal([
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
const cell = signal({ id: 0 });

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
        rows.value = [
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
        getRowId={(row) => row.Name}
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
