/* eslint-disable @typescript-eslint/no-explicit-any */
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box/Box";
import Card from "@mui/material/Card/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography/Typography";
import {signal, useSignalEffect} from "@preact/signals-react";
import {Fragment} from "react";
import {api, fdelay} from "../Utils/api";
import coupon from "/img/ResourceSink/coupon.png";

const alert = signal({ error: false, message: "" });
const data = signal<any>([]);

function ResourceSink() {
  useSignalEffect(() => {
    const interval = setInterval(async () => {
      try {
        data.value = await api.get("/getResourceSink");
        alert.value = { error: false, message: "" };
      } catch (error) {
        alert.value = {
          error: false,
          message: "Error fetching data. Please try again later.",
        };
      }
    }, fdelay.value);
    return () => {
      clearInterval(interval);
    };
  });

  function Progress() {
    return (
      <Fragment>
        <LinearProgress
          variant="determinate"
          value={data.value[0] ? data.value[0]["Percent"] : 0}
        />
      </Fragment>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
      }}
    >
      <Snackbar open={alert.value.error}>
        <Alert
          severity="error"
          sx={{
            width: "50%",
            position: "fixed",
            bottom: "10%",
            left: "25%",
          }}
          variant="filled"
        >
          {alert.value.message}
        </Alert>
      </Snackbar>
      <Card
        sx={{
          backgroundImage: `url(${coupon})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          top: "50%",
          left: "50%",
          transform: "translate(50%, 50%)",
          width: "50%",
          height: "50%",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Card
          sx={{
            position: "absolute",
            top: "25vh",
            left: "6.5vw",
            width: "37vw",
            backgroundColor: "transparent",
            boxShadow: "none",
            backgroundImage: "none",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "5vw",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            {data.value[0] ? data.value[0]["NumCoupon"] : 0}
          </Typography>
          {Progress()}
        </Card>
      </Card>
    </Box>
  );
}

export default ResourceSink;
