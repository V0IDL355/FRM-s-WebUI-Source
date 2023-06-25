import { Box } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  YAxis,
  Legend,
  Line,
  Tooltip,
} from 'recharts';
import tooltip from '../Utils/tooltip';
import pageOptions from '../Utils/page';

const detailProdRows: any[] = [];
function DetailedProd() {
  const [rows, setRows] = React.useState([]);
  const [cell, setCell] = React.useState(null as any);

  const columns: GridColDef[] = [
    { field: 'Name', headerName: 'Name', width: 150 },
    { field: 'Recipe', headerName: 'Recipe', width: 150 },
    { field: 'ManuSpeed', headerName: 'Manu Speed', width: 130 },
    {
      field: 'IsProducing',
      headerName: 'Is Producing',
      width: 130,
    },
    {
      field: 'IsPaused',
      headerName: 'Is Paused',
      width: 130,
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      try {
        fetch('http://127.0.0.1:8080/getFactory')
          .then((res) => res.json())
          .then((data) => {
            data.forEach((data) => {
              data.ManuSpeed = Math.round(data.ManuSpeed);
            });
            setRows(data);
          });
      } catch (err) {
        console.log(err);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  for (const row of rows) {
    const id =
      row['location']['x'] + row['location']['y'] + row['location']['z'];
    const index = Math.abs(Math.round(id)).toString();
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

  detailProdRows.forEach((row) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i]['location']['x'].toString() === cell?.id) {
        detailProdChart.push({
          ManuSpeed: row[i].ManuSpeed,
        });
      }
    }
  });

  return (
    <Box>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        getRowId={(row) => row['location']['x'] + row['location']['y'] + row['location']['z'].toString()}
        pageSizeOptions={pageOptions()}
        onCellClick={setCell}
      />
      <Box
        sx={{
          height: '50vh',
          width: '100%',
          position: 'relative',
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
