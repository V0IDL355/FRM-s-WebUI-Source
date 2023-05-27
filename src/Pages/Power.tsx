import { Box } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Tooltip,
  CartesianGrid,
  YAxis,
  Legend,
  Line,
} from 'recharts';
import tooltip from '../Utils/tooltip';
import pageOptions from '../Utils/page';

const powerRows: any[] = [];
function Power() {
  const [rows, setRows] = React.useState([]);
  const [cell, setCell] = React.useState(null as any);

  const columns: GridColDef[] = [
    { field: 'CircuitID', headerName: 'Circuit ID', width: 80 },
    { field: 'PowerCapacity', headerName: 'Power Capacity (MW)', width: 150 },
    {
      field: 'PowerProduction',
      headerName: 'Power Production (MW)',
      width: 180,
    },
    {
      field: 'PowerConsumed',
      headerName: 'Power Consumed (MW)',
      width: 180,
    },
    {
      field: 'PowerMaxConsumed',
      headerName: 'Max Consumed (MW)',
      width: 180,
    },
    {
      field: 'BatteryDifferential',
      headerName: 'Battery Differential (MW)',
      width: 180,
    },
    { field: 'BatteryPercent', headerName: 'Battery Percent (%)', width: 150 },
    { field: 'BatteryCapacity', headerName: 'Battery Capacity', width: 150 },
    {
      field: 'BatteryTimeEmpty',
      headerName: 'Time Till Battery Empty',
      width: 180,
    },
    {
      field: 'BatteryTimeFull',
      headerName: 'Time Till Battery Full',
      width: 150,
    },
    {
      field: 'FuseTriggered',
      headerName: 'Fuse Triggered',
      width: 150,
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      try {
        fetch('http://localhost:8080/getPower')
          .then((res) => res.json())
          .then((data) => {
            data.forEach(
              (data: {
                PowerCapacity: number;
                PowerProduction: number;
                PowerConsumed: number;
                PowerMaxConsumed: number;
                BatteryDifferential: number;
                BatteryCapacity: number;
              }) => {
                data.PowerCapacity = Math.round(data.PowerCapacity);
                data.PowerProduction = Math.round(data.PowerProduction);
                data.PowerConsumed = Math.round(data.PowerConsumed);
                data.PowerMaxConsumed = Math.round(data.PowerMaxConsumed);
                data.BatteryDifferential = Math.round(data.BatteryDifferential);
                data.BatteryCapacity = Math.round(data.BatteryCapacity);
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
    if (!powerRows[row['CircuitID']]) {
      powerRows[row['CircuitID']] = [];
    }

    if (powerRows[row['CircuitID']].length >= 10) {
      powerRows[row['CircuitID']].shift();
    } else {
      powerRows[row['CircuitID']].push(row);
    }
  }

  const powerChart: any[] = [];

  for (let v = 0; v < powerRows.length; v++) {
    if (powerRows[v]) {
      for (let i = 0; i < powerRows[v].length; i++) {
        if (powerRows[v][i]['CircuitID'] === cell?.id) {
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
          height: '50vh',
          width: '100%',
          position: 'relative',
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
