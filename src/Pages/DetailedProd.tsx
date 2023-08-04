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

const detailProdRows: any[] = [];
function DetailedProd() {
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState([
    {
      Name: "Constructor",
      ClassName: "Build_ConstructorMk1_C",
      location: {
        x: -101321.6640625,
        y: -130824.890625,
        z: -1410.1580810546875,
        rotation: 100,
      },
      Recipe: "Actual Snow",
      RecipeClassName: "",
      production: [
        {
          Name: "Actual Snow",
          ClassName: "Desc_Snow_C",
          Amount: 0,
          CurrentProd: 0,
          MaxProd: 0,
          ProdPercent: 0,
        },
      ],
      ingredients: [
        {
          Name: "FICSMAS Gift",
          ClassName: "Desc_Gift_C",
          Amount: 0,
          CurrentConsumed: 0,
          MaxConsumed: 0,
          ConsPercent: 0,
        },
      ],
      ManuSpeed: 0,
      IsConfigured: true,
      IsProducing: false,
      IsPaused: false,
      CircuitID: 1,
      features: {
        properties: {
          name: "Constructor",
          type: "",
        },
        geometry: {
          coordinates: {
            X: -101321.6640625,
            Y: -130824.890625,
            Z: -1410.1580810546875,
          },
          type: "Point",
        },
      },
    },
    {
      Name: "Constructor",
      ClassName: "Build_ConstructorMk1_C",
      location: {
        x: -91321.6640625,
        y: -130824.890625,
        z: -1210.1580810546875,
        rotation: 100,
      },
      Recipe: "Actual Snow D",
      RecipeClassName: "",
      production: [
        {
          Name: "Actual Snow D",
          ClassName: "Desc_Snow_C",
          Amount: 0,
          CurrentProd: 0,
          MaxProd: 0,
          ProdPercent: 0,
        },
      ],
      ingredients: [
        {
          Name: "FICSMAS Gift",
          ClassName: "Desc_Gift_C",
          Amount: 0,
          CurrentConsumed: 0,
          MaxConsumed: 0,
          ConsPercent: 0,
        },
      ],
      ManuSpeed: 0,
      IsConfigured: true,
      IsProducing: false,
      IsPaused: false,
      CircuitID: 1,
      features: {
        properties: {
          name: "Constructor",
          type: "",
        },
        geometry: {
          coordinates: {
            X: -91321.6640625,
            Y: -130824.890625,
            Z: -1210.1580810546875,
          },
          type: "Point",
        },
      },
    },
  ]);
  const [cell, setCell] = React.useState(null as any);

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

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result: Array<any> = await api.get("/getFactory");
        result.forEach((data) => {
          data.ManuSpeed = Math.round(data.ManuSpeed);
          console.log(data);
        });
        setRows(result);
        setError(null);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        setRows([
          {
            Name: "Constructor",
            ClassName: "Build_ConstructorMk1_C",
            location: {
              x: -101321.6640625,
              y: -130824.890625,
              z: -1410.1580810546875,
              rotation: 100,
            },
            Recipe: "Actual Snow",
            RecipeClassName: "",
            production: [
              {
                Name: "Actual Snow",
                ClassName: "Desc_Snow_C",
                Amount: Math.round(Math.random() * 100),
                CurrentProd: Math.round(Math.random() * 100),
                MaxProd: Math.round(Math.random() * 100),
                ProdPercent: 0,
              },
            ],
            ingredients: [
              {
                Name: "FICSMAS Gift",
                ClassName: "Desc_Gift_C",
                Amount: Math.round(Math.random() * 100),
                CurrentConsumed: Math.round(Math.random() * 100),
                MaxConsumed: Math.round(Math.random() * 100),
                ConsPercent: 0,
              },
            ],
            ManuSpeed: Math.round(Math.random() * 100),
            IsConfigured: true,
            IsProducing: false,
            IsPaused: false,
            CircuitID: 1,
            features: {
              properties: {
                name: "Constructor",
                type: "",
              },
              geometry: {
                coordinates: {
                  X: -101321.6640625,
                  Y: -130824.890625,
                  Z: -1410.1580810546875,
                },
                type: "Point",
              },
            },
          },
          {
            Name: "Constructor",
            ClassName: "Build_ConstructorMk1_C",
            location: {
              x: -91321.6640625,
              y: -130824.890625,
              z: -1210.1580810546875,
              rotation: 100,
            },
            Recipe: "Actual Snow D",
            RecipeClassName: "",
            production: [
              {
                Name: "Actual Snow D",
                ClassName: "Desc_Snow_C",
                Amount: Math.round(Math.random() * 100),
                CurrentProd: Math.round(Math.random() * 100),
                MaxProd: Math.round(Math.random() * 100),
                ProdPercent: 0,
              },
            ],
            ingredients: [
              {
                Name: "FICSMAS Gift",
                ClassName: "Desc_Gift_C",
                Amount: Math.round(Math.random() * 100),
                CurrentConsumed: Math.round(Math.random() * 100),
                MaxConsumed: Math.round(Math.random() * 100),
                ConsPercent: 0,
              },
            ],
            ManuSpeed: Math.round(Math.random() * 100),
            IsConfigured: true,
            IsProducing: false,
            IsPaused: false,
            CircuitID: 1,
            features: {
              properties: {
                name: "Constructor",
                type: "",
              },
              geometry: {
                coordinates: {
                  X: -91321.6640625,
                  Y: -130824.890625,
                  Z: -1210.1580810546875,
                },
                type: "Point",
              },
            },
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
  if (detailProdRows[cell?.id]) {
    for (const row of detailProdRows[cell?.id]) {
      detailProdChart.push({
        ManuSpeed: row.ManuSpeed,
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
        getRowId={(row) =>
          Math.round(
            row["location"]["x"] + row["location"]["y"] + row["location"]["z"]
          )
        }
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
