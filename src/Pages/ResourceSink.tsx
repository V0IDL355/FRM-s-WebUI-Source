/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box/Box";
import coupon from "/img/ResourceSink/coupon.png";
import Typography from "@mui/material/Typography/Typography";
import React from "react";
import Card from "@mui/material/Card/Card";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import api from "../Utils/api";

function ResourceSink() {
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState([
    {
      Name: "A.W.E.S.O.M.E.",
      NumCoupon: Math.round(0),
      Percent: Math.round(0),
      GraphPoints: [
        {
          Index: 0,
          value: 0,
        },
        {
          Index: 1,
          value: 0,
        },
        {
          Index: 2,
          value: 0,
        },
        {
          Index: 3,
          value: 0,
        },
        {
          Index: 4,
          value: 0,
        },
        {
          Index: 5,
          value: 0,
        },
        {
          Index: 6,
          value: 0,
        },
        {
          Index: 7,
          value: 0,
        },
        {
          Index: 8,
          value: 0,
        },
        {
          Index: 9,
          value: 0,
        },
      ],
      PointsToCoupon: 0,
      TotalPoints: 0,
    },
  ]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result: Array<any> = await api.get("/getResourceSink");
        setData(result);
        setError(null);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        setData([
          {
            Name: "A.W.E.S.O.M.E.",
            NumCoupon: Math.round(Math.floor(Math.random() * 1000000)),
            Percent: Math.round(Math.random() * 100),
            GraphPoints: [
              {
                Index: 0,
                value: 33218,
              },
              {
                Index: 1,
                value: 37837,
              },
              {
                Index: 2,
                value: 110488,
              },
              {
                Index: 3,
                value: 34840,
              },
              {
                Index: 4,
                value: 75563,
              },
              {
                Index: 5,
                value: 105934,
              },
              {
                Index: 6,
                value: 32933,
              },
              {
                Index: 7,
                value: 150480,
              },
              {
                Index: 8,
                value: 223927,
              },
              {
                Index: 9,
                value: 148770,
              },
            ],
            PointsToCoupon: 14902634,
            TotalPoints: 3334555366,
          },
        ]);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function Progress() {
    return (
      <React.Fragment>
        <LinearProgress
          sx={{
            backgroundColor: "primary",
          }}
          variant="determinate"
          value={data[0] ? data[0].Percent : 0}
        />
      </React.Fragment>
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
      <Snackbar open={!!error}>
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
          {error}
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
            {data[0] ? data[0].NumCoupon : 0}
          </Typography>
          {Progress()}
        </Card>
      </Card>
    </Box>
  );
}

export default ResourceSink;
