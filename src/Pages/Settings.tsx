import { Alert, Box, Snackbar, TextField } from "@mui/material";
import React from "react";

function Settings() {
  const [errOpen, setErrOpen] = React.useState(false);
  const [succOpen, setSuccessOpen] = React.useState(false);

  function validIp(ip) {
    return !!ip.match(
      /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b:[0-9]\d+\b/g
    );
  }

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessOpen(false);
    setErrOpen(false);
  };

  return (
    <Box>
      <Snackbar open={succOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          variant="filled"
          severity="success"
          sx={{
            width: "50%",
            position: "fixed",
            bottom: "10%",
            left: "25%",
          }}
        >
          Successfully changed the used ip
        </Alert>
      </Snackbar>
      <Snackbar open={errOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          variant="filled"
          severity="error"
          sx={{
            width: "50%",
            position: "fixed",
            bottom: "10%",
            left: "25%",
          }}
        >
          Invalid ip address example: 127.0.0.1:8080
        </Alert>
      </Snackbar>
      <TextField
        label="Ip:Port"
        defaultValue={localStorage.getItem("ip")}
        variant="outlined"
        sx={{ top: 10 }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (validIp(event.target.value)) {
            console.log(validIp(event.target.value));
            localStorage.setItem("ip", event.target.value);
            setErrOpen(false);
            setSuccessOpen(true);
          } else {
            console.log(event.target.value);
            setErrOpen(true);
            setSuccessOpen(false);
          }
        }}
      ></TextField>
    </Box>
  );
}

export default Settings;
