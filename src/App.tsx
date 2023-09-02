import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Container,
  CssBaseline,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import * as Icons from "@mui/icons-material";

import Home from "./Pages/Home";
import Map from "./Pages/Map";
import Power from "./Pages/Power";
import Drone from "./Pages/Drone";
import OverallProd from "./Pages/OverallProd";
import DetailedProd from "./Pages/DetailedProd";
import ResourceSink from "./Pages/ResourceSink";

import Settings from "./Pages/Settings";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#e8a361" },
    secondary: { main: "#ca6d35" },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    coupon: Palette["primary"];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    coupon?: PaletteOptions["primary"];
  }
}

const MainComponent: React.FC = () => {
  const [value, setValue] = React.useState(0);

  if (!localStorage.getItem("ip")) {
    localStorage.setItem("ip", "127.0.0.1:8080");
  }

  if (!localStorage.getItem("fspeed")) {
    localStorage.setItem("fspeed", "1000");
  }
  if (!localStorage.getItem("fspeed")) {
    localStorage.setItem("mfspeed", "2500");
  }

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
            {value === 7 && <Settings />}
          </Box>
          {/* At the bottom of the page */}

          <Box
            sx={{
              bgcolor: "black",
              background: "black",
            }}
          >
            <BottomNavigation
              value={value}
              onChange={(_event, newValue) => {
                setValue(newValue);
              }}
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: "-100vh",
                width: "100%",
              }}
            >
              <BottomNavigationAction icon={<Icons.Home />} label="Home" />
              <BottomNavigationAction
                icon={<Icons.Print />}
                label="Resource Sink"
              />
              <BottomNavigationAction icon={<Icons.Map />} label="Map" />
              <BottomNavigationAction icon={<Icons.Power />} label="Power" />
              <BottomNavigationAction icon={<Icons.Flight />} label="Drone" />
              <BottomNavigationAction
                icon={<Icons.Factory />}
                label="Overall Prod"
              />
              <BottomNavigationAction
                icon={<Icons.Factory />}
                label="Detailed Prod"
              />
              <BottomNavigationAction
                icon={<Icons.Settings />}
                label="Settings"
              />
            </BottomNavigation>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return <MainComponent />;
};

export default App;
