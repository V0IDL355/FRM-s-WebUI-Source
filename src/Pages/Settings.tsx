import {
  Alert,
  Box,
  Container,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

function Settings() {
  const [error, setError] = React.useState<boolean>(false);
  const [alertText, setAlertText] = React.useState<string>("");

  return (
    <Box>
      <Container>
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
        <Paper
          elevation={0}
          sx={{
            top: 20,
            display: "grid",
            position: "fixed",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>Global</Typography>
          <TextField
            label="Ip:Port"
            defaultValue={localStorage.getItem("ip")}
            variant="outlined"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              await fetch(`http://${event.target.value}/getPlayer`)
                .finally(() => {
                  localStorage.setItem("ip", event.target.value);
                  setError(false);
                  setAlertText("Valid IP!");
                })
                .catch(() => {
                  setError(true);
                  setAlertText("Invalid IP!");
                });
            }}
          ></TextField>
          <TextField
            sx={{ marginTop: 1 }}
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
            sx={{ marginTop: 1 }}
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
        </Paper>
      </Container>
    </Box>
  );
}

export default Settings;
