import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline, useMediaQuery } from "@mui/material";

import Home from "./Pages/Home";
import Map from "./Pages/Map";
import Power from "./Pages/Power";
import Drone from "./Pages/Drone";
import OverallProd from "./Pages/OverallProd";
import DetailedProd from "./Pages/DetailedProd";
import Settings from "./Pages/Settings";
import ResourceSink from "./Pages/ResourceSink";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import React, { FC } from "react";
import Navigation from "./Pages/Navigation";
import NotFoundPage from "./Pages/404";
import pages from "./Utils/pages";

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

  interface PaletteOptions {
    coupon?: PaletteOptions["primary"];
  }
}

function checkLocalStorage() {
  if (!localStorage.getItem("ip")) {
    localStorage.setItem("ip", "127.0.0.1:8080");
  }

  if (!localStorage.getItem("fspeed")) {
    localStorage.setItem("fspeed", "1000");
  }
  if (!localStorage.getItem("mfspeed")) {
    localStorage.setItem("mfspeed", "2500");
  }
}

const MainComponent: FC = () => {
  checkLocalStorage();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Container>
          <Navigation />
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="/FRM-s-WebUI-Source" element={<Home />} />
              <Route path="*" element={<NotFoundPage />} />
              {pages.map((page) => (
                <Route
                  key={page.label}
                  path={`/${page.link}`}
                  element={page.node}
                />
              ))}
            </Routes>
          </BrowserRouter>
        </Container>
      </div>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return <MainComponent />;
};

export default App;
