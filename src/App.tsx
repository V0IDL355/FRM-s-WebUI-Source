import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { Alert, Container, CssBaseline, Snackbar } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import NotFoundPage from "./Pages/404";
import Home from "./Pages/Home";
import Navigation from "./Pages/Navigation";
import pages from "./Utils/pages";
import { theme } from "./Utils/theme";
import { signal } from "@preact/signals-react";

function checkLocalStorage() {
  localStorage.getItem("ip") ? "" : localStorage.setItem("ip", "127.0.0.1:8080");
  localStorage.getItem("fspeed") ? "" : localStorage.setItem("fspeed", "1000");
  localStorage.getItem("mfspeed") ? "" : localStorage.setItem("mfspeed", "2500");
}

// eslint-disable-next-line react-refresh/only-export-components
export const alert = signal({ error: false, message: "" });

const MainComponent: FC = () => {
  checkLocalStorage();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Container>
          <Snackbar
            open={alert.value.error}
            autoHideDuration={6000}
            onClose={() => {
              alert.value = { error: false, message: "" };
            }}
          >
            <Alert
              variant="filled"
              severity={alert.value.error ? "error" : "success"}
              sx={{
                width: "50%",
                position: "fixed",
                bottom: "10%",
                left: "25%",
              }}
            >
              {alert.value.message}
            </Alert>
          </Snackbar>
          <Navigation />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFoundPage />} />
            {pages.map((page) => (
              <Route
                key={page.label}
                path={`/${page.link}`}
                element={page.node}
              />
            ))}
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return <MainComponent />;
};

export default App;
