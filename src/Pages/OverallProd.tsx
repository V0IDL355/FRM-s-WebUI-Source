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

const overallProdRows: any[] = [];
function OverallProd() {
  const [rows, setRows] = React.useState([]);
  const [cell, setCell] = React.useState(null as any);
  const columns: GridColDef[] = [
    { field: 'Name', headerName: 'Name', width: 200 },
    { field: 'ProdPerMin', headerName: 'Prod Per Min', width: 250 },
    { field: 'ConsPercent', headerName: 'Cons Percent (%)', width: 130 },
    {
      field: 'ProdPercent',
      headerName: 'Prod Percent (%)',
      width: 130,
    },
    {
      field: 'CurrentProd',
      headerName: 'Current Prod',
      width: 130,
    },
    {
      field: 'MaxProd',
      headerName: 'Max Prod',
      width: 150,
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      try {
        fetch('http://localhost:8080/getProdStats')
          .then((res) => res.json())
          .then((data) => {
            data.forEach(
              (data: {
                CurrentProd: number;
                ProdPercent: number;
                ConsPercent: number;
                MaxProd: number;
              }) => {
                data.ProdPercent = Math.round(data.ProdPercent);
                data.ConsPercent = Math.round(data.ConsPercent);
                data.MaxProd = Math.round(data.MaxProd);
                data.CurrentProd = Math.round(data.CurrentProd);
              }
            );

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
    if (!overallProdRows[row['Name']]) {
      overallProdRows[row['Name']] = [];
    }

    if (overallProdRows[row['Name']].length >= 10) {
      overallProdRows[row['Name']].shift();
    } else {
      overallProdRows[row['Name']].push(row);
    }
  }

  const overallProdChart: any[] = [];

  if (overallProdRows[cell?.id]) {
    for (const row of overallProdRows[cell?.id]) {
      overallProdChart.push({
        MaxProd: row['MaxProd'],
        CurrentProd: row['CurrentProd'],
        ProdPercent: row['ProdPercent'],
        ConsPercent: row['ConsPercent'],
      });
    }
  }

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
        getRowId={(row) => row.Name}
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
