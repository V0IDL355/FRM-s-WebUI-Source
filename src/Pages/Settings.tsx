import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  InputAdornment,
  List,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import React from "react";

function Settings() {
  const defaultP = "#e8a361";
  const defaultS = "#ca6d35";
  const [error, setError] = React.useState<boolean>(false);
  const [alertText, setAlertText] = React.useState<string>("");

  const [primaryColor, setPValue] = React.useState(
    localStorage.getItem("primaryC") || defaultP
  );
  const [secondaryColor, setSValue] = React.useState(
    localStorage.getItem("secondaryC") || defaultS
  );

  function resetDefault() {
    localStorage.setItem("primaryC", defaultP);
    setPValue(defaultP);

    localStorage.setItem("secondaryC", defaultS);
    setSValue(defaultS);
    window.location.reload();
  }

  const handleChangeP = (newValue) => {
    setPValue(newValue);
    localStorage.setItem("primaryC", newValue);
  };

  const handleChangeS = (newValue) => {
    setSValue(newValue);
    localStorage.setItem("secondaryC", newValue);
  };

  return (
    <Box>
      <Container>
        <Box>
          <Snackbar
            open={alertText != ""}
            autoHideDuration={6000}
            onClose={() => {
              setError(false);
              setAlertText("");
            }}
          >
            <Alert
              variant="filled"
              severity={error ? "error" : "success"}
              sx={{
                width: "50%",
                position: "fixed",
                bottom: "10%",
                left: "25%",
              }}
            >
              {alertText}
            </Alert>
          </Snackbar>
          <Typography sx={{ textAlign: "center", fontSize: "2ex" }}>
            Web UI Version : {import.meta.env.PACKAGE_VERSION}
          </Typography>
          <List
            sx={{
              width: "100%",
            }}
          >
            <Card elevation={0} sx={{ margin: 5 }}>
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography sx={{ textAlign: "center" }}>Global</Typography>
                <TextField
                  fullWidth={true}
                  label="Ip:Port"
                  defaultValue={localStorage.getItem("ip")}
                  variant="outlined"
                  onChange={async (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    await fetch(`http://${event.target.value}/getCoffee`)
                      .then((response) => {
                        if (response.status === 418) {
                          localStorage.setItem("ip", event.target.value);
                          setError(false);
                          setAlertText("Valid IP!");
                          return true;
                        }
                      })
                      .catch(() => {
                        setError(true);
                        setAlertText("Invalid IP!");
                        return false;
                      });
                  }}
                ></TextField>
                <TextField
                  sx={{ marginTop: "10px" }}
                  fullWidth={true}
                  label="Fetch Speed"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ms</InputAdornment>
                    ),
                  }}
                  defaultValue={localStorage.getItem("fspeed")}
                  variant="outlined"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (parseInt(event.target.value)) {
                      localStorage.setItem("fspeed", event.target.value);
                      setError(false);
                      setAlertText("Valid speed!");
                    } else {
                      setError(true);
                      setAlertText("Invalid speed!");
                    }
                  }}
                ></TextField>
                <TextField
                  sx={{ marginTop: "10px" }}
                  fullWidth={true}
                  label="Map Fetch Speed"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ms</InputAdornment>
                    ),
                  }}
                  defaultValue={localStorage.getItem("mfspeed")}
                  variant="outlined"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (parseInt(event.target.value)) {
                      localStorage.setItem("mfspeed", event.target.value);
                      setError(false);
                      setAlertText("Valid speed!");
                    } else {
                      setError(true);
                      setAlertText("Invalid speed!");
                    }
                  }}
                ></TextField>
              </Card>
              <Box sx={{ margin: "10px" }}></Box>
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography sx={{ textAlign: "center", fontStyle: "bold" }}>
                  Theme
                </Typography>
                <Tooltip title="Primary Color">
                  <MuiColorInput
                    fullWidth={true}
                    value={primaryColor}
                    onChange={handleChangeP}
                  />
                </Tooltip>
                <Tooltip sx={{ marginTop: "10px" }} title="Secondary Color">
                  <MuiColorInput
                    fullWidth={true}
                    value={secondaryColor}
                    onChange={handleChangeS}
                  />
                </Tooltip>
                <Button
                  sx={{ marginTop: "10px" }}
                  variant="outlined"
                  onClick={() => {
                    window.location.reload();
                  }}
                  fullWidth
                >
                  Refresh To Apply
                </Button>
                <Button
                  sx={{ marginTop: "10px" }}
                  variant="outlined"
                  onClick={resetDefault}
                  fullWidth
                >
                  Reset To Default
                </Button>
              </Card>
            </Card>
          </List>
        </Box>
      </Container>
    </Box>
  );
}

export default Settings;
