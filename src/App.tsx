import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import Box from '@mui/material/Box';

import Tabs from '@mui/material/Tabs/Tabs';
import Tab from '@mui/material/Tab/Tab';

import Home from './Pages/Home';
import Map from './Pages/Map';
import Power from './Pages/Power';
import Drone from './Pages/Drone';
import OverallProd from './Pages/OverallProd';
import DetailedProd from './Pages/DetailedProd';
import ResourceSink from './Pages/ResourceSink';

import * as Icons from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e8a361' },
    secondary: { main: '#ca6d35' },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    coupon: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    coupon?: PaletteOptions['primary'];
  }
}

function App() {
  const [value, setValue] = React.useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Container>
          <Box sx={{ paddingBottom: 10 }}>
            {value === 0 && <Home />}
            {value === 1 && <ResourceSink />}
            {value === 2 && <Map />}
            {value === 3 && <Power />}
            {value === 4 && <Drone />}
            {value === 5 && <OverallProd />}
            {value === 6 && <DetailedProd />}
          </Box>
          {/* At the bottom of the page */}

          <Tabs
            value={value}
            onChange={(_event, newValue) => {
              setValue(newValue);
            }}
            variant="fullWidth"
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '-100vh',
              width: '100%',
            }}
          >
            <Tab icon={<Icons.Home />} label="Home" />
            <Tab icon={<Icons.Print />} label="Resource Sink" />
            <Tab icon={<Icons.Map />} label="Map" />
            <Tab icon={<Icons.Power />} label="Power" />
            <Tab icon={<Icons.Flight />} label="Drone" />
            <Tab icon={<Icons.Factory />} label="Overall Prod" />
            <Tab icon={<Icons.Factory />} label="Detailed Prod" />
          </Tabs>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
