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

const droneRows: any[] = [];
function Drone() {
  const [rows, setRows] = React.useState([]);
  const [cell, setCell] = React.useState(null as any);
  const columns: GridColDef[] = [
    { field: 'PairedStation', headerName: 'Paired Station', width: 130 },
    {
      field: 'DroneStatus',
      headerName: 'Drone Status',
      width: 130,
    },
    { field: 'AvgTotalIncRate', headerName: 'Avg Total Inc Rate', width: 150 },
    {
      field: 'AvgTotalOutRate',
      headerName: 'Avg Total Out Rate',
      width: 150,
    },
    {
      field: 'EstBatteryRate',
      headerName: 'Est Battery Rate',
      width: 150,
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      try {
        fetch('http://localhost:8080/getDroneStation')
          .then((res) => res.json())
          .then((data) => {
            data.forEach(
              (data: {
                AvgTotalIncRate: number;
                AvgTotalOutRate: number;
                EstBatteryRate: number;
              }) => {
                data.AvgTotalIncRate = Math.round(data.AvgTotalIncRate);
                data.AvgTotalOutRate = Math.round(data.AvgTotalOutRate);
                data.EstBatteryRate = Math.round(data.EstBatteryRate);
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
    if (!droneRows[row['ID']]) {
      droneRows[row['ID']] = [];
    }

    if (droneRows[row['ID']].length >= 10) {
      droneRows[row['ID']].shift();
    } else {
      droneRows[row['ID']].push(row);
    }
  }

  const droneChart: any[] = [];

  if (droneRows[cell?.id]) {
    for (const row of droneRows[cell?.id]) {
      droneChart.push({
        AvgTotalIncRate: row['AvgTotalIncRate'],
        AvgTotalOutRate: row['AvgTotalOutRate'],
        EstBatteryRate: row['EstBatteryRate'],
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
        getRowId={(row) => row.ID}
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
