import {
  Box,
  ButtonGroup,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
function Home() {
  const thanksTo = [
    {
      id: 0,
      name: "Feyko",
      reason: "Support and guidance to a noob Unreal Engine modder",
      link: "https://discordapp.com/users/227473074616795137",
    },
    {
      id: 1,
      name: "Robb",
      reason: "Answering my dumb questions",
      link: "https://discordapp.com/users/187385442549628928",
    },
    {
      id: 2,
      name: "Vilsol",
      reason:
        "Also answering my dumb questions and helping with the documentation system",
      link: "https://discordapp.com/users/135134753534771201",
    },
    {
      id: 3,
      name: "Nog",
      reason: "Answering the dumbest of my questions",
      link: "https://discordapp.com/users/277050857852370944",
    },
    {
      id: 4,
      name: "Archengius",
      reason: "Helping with the UE Garbage Collection Issue",
      link: "https://discordapp.com/users/163955176313585666",
    },
    {
      id: 5,
      name: "Deantendo",
      reason: "Icon/Graphic for FRM",
      link: "https://discordapp.com/users/293484684787056640",
    },
    {
      id: 6,
      name: "Andre Aquila",
      reason:
        "Production Stats code for FRM (Seriously, that would have taken me forever to develop",
      link: "https://discordapp.com/users/294943551605702667",
    },
    {
      id: 7,
      name: "Badger",
      reason: "For the FRM Companion App",
      link: "https://discordapp.com/users/186896287856197633",
    },
    {
      id: 8,
      name: "BLAndrew575",
      reason:
        "For giving me a crazy world to brutally stress test the getFactory caching function",
      link: "https://discordapp.com/users/509759568037937152",
    },
    {
      id: 9,
      name: "GalaxyVOID",
      reason: "Contributions to FRM's native web UI",
      link: "https://discordapp.com/users/212243828831289344",
    },
    {
      id: 10,
      name: "FeatheredToast",
      reason: "Finding and helping resolve the dumb things I did dumb",
      link: "https://discordapp.com/users/130401633564753920",
    },
    {
      id: 11,
      name: "Satisfactory Modding Discord",
      reason:
        "For motivating me and letting me vent as I go through my day and also develop this mod",
      link: "https://discord.gg/amuR4xyqP8",
    },
  ];

  return (
    <Box>
      <ButtonGroup
        fullWidth={true}
        sx={{ top: 0, right: 0, left: 0, position: "absolute" }}
        aria-label="outlined primary button group"
        variant="outlined"
      >
        <Button
          onClick={() => {
            window.location.href =
              "https://docs.ficsit.app/ficsitremotemonitoring/latest/index.html";
          }}
        >
          Documentation <Icons.Description />
        </Button>
        <Button
          onClick={() => {
            window.location.href =
              "https://github.com/porisius/FicsitRemoteMonitoring";
          }}
        >
          GitHub <Icons.GitHub />
        </Button>
        <Button
          onClick={() => {
            window.location.href = "https://discord.gg/tv3jbJW3RX";
          }}
        >
          Discord <Icons.Group />
        </Button>
      </ButtonGroup>

      <Box sx={{ top: 100, right: 5, left: 5, position: "absolute" }}>
        <Grid container spacing={2}>
          <Typography
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            variant="h2"
          >
            Thanks:
          </Typography>
          {thanksTo.map((thanks) => (
            <Grid
              item
              key={thanks.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              padding={1}
              marginBottom={1}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{thanks.name}</Typography>
                  <Typography variant="body2">{thanks.reason}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => {
                      window.location.href = thanks.link;
                    }}
                    size="small"
                  >
                    <Icons.Link />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
