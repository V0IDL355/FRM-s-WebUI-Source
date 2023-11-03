/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, useMap } from "react-leaflet";
import {
  CRS,
  Icon,
  LatLng,
  Marker,
  LayerGroup,
  Popup,
  imageOverlay,
  Point,
} from "leaflet";
import Typography from "@mui/material/Typography/Typography";
import Box from "@mui/material/Box/Box";
import ReactDOMServer from "react-dom/server";
import ButtonGroup from "@mui/material/ButtonGroup/ButtonGroup";
import Button from "@mui/material/Button/Button";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import Card from "@mui/material/Card/Card";
import ListItem from "@mui/material/ListItem/ListItem";
import List from "@mui/material/List/List";
import CardContent from "@mui/material/CardContent/CardContent";
import api from "../Utils/api";
import { Snackbar, Alert, Container, Paper } from "@mui/material";
import axios from "axios";
import { Add, Layers, Remove } from "@mui/icons-material";
import { signal, useSignalEffect } from "@preact/signals-react";
import styled from "styled-components";
import { theme } from "../Utils/theme";

const adjustColor = (hex: string, percent: number): string => {
  hex = hex.replace("#", "");

  const num = parseInt(hex, 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 255) + percent;
  let b = (num & 255) + percent;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const PopupWrapper = styled.div`
  & .leaflet-popup-content-wrapper,
  & .leaflet-popup-tip {
    background: ${adjustColor(
      theme.palette.background.default,
      10
    )}; /* Using theme-based primary color */
    color: ${theme.palette.text.primary};
    box-shadow: 0 0 14px 2px rgb(255 255 255 / 40%);
    border-radius: 10px;
  }
`;

const bounds: L.LatLngBoundsExpression = [
  [-375e3, -324698.832031],
  [375e3, 425301.832031],
];

const mapImg = imageOverlay("/img/Map/map.png", bounds);

const playerGroup = new LayerGroup();
const droneGroup = new LayerGroup();
const droneStationGroup = new LayerGroup();
const trainGroup = new LayerGroup();
const trainStationGroup = new LayerGroup();
const vehicleGroup = new LayerGroup();
const radarTowerGroup = new LayerGroup();
const powerSlugGroup = new LayerGroup();
const truckStationGroup = new LayerGroup();
const spaceElevatorGroup = new LayerGroup();

const train = new Icon({
  iconUrl: "/img/Map/train.png",
});

const train_station = new Icon({
  iconUrl: "/img/Map/train_station.png",
});

const player = new Icon({
  iconUrl: "/img/Map/player.png",
});

const player_dead = new Icon({
  iconUrl: "/img/Map/player_dead.png",
});

const truck = new Icon({
  iconUrl: "/img/Map/truck.png",
});

const truck_station = new Icon({
  iconUrl: "/img/Map/truck_station.png",
});

const explorer = new Icon({
  iconUrl: "/img/Map/explorer.png",
});

const tractor = new Icon({
  iconUrl: "/img/Map/tractor.png",
});

const drone = new Icon({
  iconUrl: "/img/Map/drone.png",
});

const drone_station = new Icon({
  iconUrl: "/img/Map/drone_station.png",
});

const power_slug = new Icon({
  iconUrl: "/img/Map/power_slug.png",
});

const radar_tower = new Icon({
  iconUrl: "/img/Map/radar_tower.png",
});

const space_elevator = new Icon({
  iconUrl: "/img/Map/space_elevator.png",
});

const alert = signal({ error: false, message: "" });
const open = signal(false);
const map = signal<any>(null);

function Map() {
  function RealtimeLayerLoader({
    url,
    type,
    layerGroup,
  }: {
    url: string;
    type: string;
    layerGroup: L.LayerGroup;
  }) {
    useSignalEffect(() => {
      const cancelTokenSource = axios.CancelToken.source();
      const fetchData = async () => {
        try {
          const result: Array<any> = await api.get(url, {
            cancelToken: cancelTokenSource.token,
          });
          const getGeo = result;
          layerGroup.clearLayers();
          for (let i = 0; i < getGeo.length; i++) {
            try {
              const lat = (getGeo[i].location.y | getGeo[i].location.Y) * -1;
              const lon = getGeo[i].location.x | getGeo[i].location.X;
              const markerLocation = new LatLng(lat, lon);

              const marker = new Marker(markerLocation);

              let popupContent: () => JSX.Element | null = () => (
                <Card>
                  <CardContent>
                    <Typography variant="h2" gutterBottom>
                      Sample Text
                    </Typography>
                  </CardContent>
                </Card>
              );
              switch (type) {
                case "Player":
                  popupContent = () => (
                    <Paper>
                      <Typography variant="h2" gutterBottom>
                        Player: {getGeo[i].PlayerName}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Ping Time: {getGeo[i].PingTime} ms
                      </Typography>
                    </Paper>
                  );
                  getGeo[i].Dead
                    ? marker.setIcon(player_dead)
                    : marker.setIcon(player);
                  break;
                case "Drone":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Destination: {getGeo[i].CurrentDestination}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Flying Speed: {Math.round(getGeo[i].FlyingSpeed)}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Flying:{" "}
                        {Math.round(getGeo[i].FlyingSpeed) > 0 ? "✅" : "❌"}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(drone);
                  break;
                case "Trains":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Train Name: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Speed: {getGeo[i].ForwardSpeed}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Derailed: {getGeo[i].Derailed ? "✅" : "❌"}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Train Station: {getGeo[i].TrainStation}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(train);
                  break;
                case "Vehicles":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Vehicle Type: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        AutoPilot: {getGeo[i].AutoPilot ? "✅" : "❌"}
                      </Typography>
                    </Box>
                  );

                  switch (getGeo[i].Name) {
                    case "Explorer":
                      marker.setIcon(explorer);
                      break;
                    case "Truck":
                      marker.setIcon(truck);
                      break;
                    case "Tractor":
                      marker.setIcon(tractor);
                      break;
                    default:
                      marker.setIcon(explorer);
                      break;
                  }
                  break;
                case "Drone Station":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Name: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Paired Station: {getGeo[i].PairedStation}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(drone_station);
                  break;
                case "Train Stations":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Name: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        LoadingStatus:{" "}
                        {(() => {
                          switch (getGeo[i].LoadingStatus) {
                            case "Idle":
                              return <span>Idle ⏸️</span>;
                            case "Loading":
                              return <span>Loading ⬆️</span>;
                            case "Unloading":
                              return <span>Unloading ⬇️</span>;
                            default:
                              return null;
                          }
                        })()}
                        ;
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        LoadingMode:{" "}
                        {(() => {
                          switch (getGeo[i].LoadingMode) {
                            case "Loading":
                              return <span>Load ⬆️</span>;
                            case "Unloading":
                              return <span>Unload ⬇️</span>;
                            default:
                              return null;
                          }
                        })()}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(train_station);
                  break;
                case "Radar Tower":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Name: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        X: {getGeo[i].location.X.toString()}
                        Y: {getGeo[i].location.Y.toString()}
                        Z: {getGeo[i].location.Z.toString()}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(radar_tower);
                  break;
                case "Power Slug":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Slug Type: {getGeo[i].SlugType}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        X: {getGeo[i].location.x.toString()}
                        Y: {getGeo[i].location.y.toString()}
                        Z: {getGeo[i].location.z.toString()}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(power_slug);
                  break;
                case "Truck Station":
                  popupContent = () => (
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Name: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        LoadMode:{" "}
                        {(() => {
                          switch (getGeo[i].LoadMode) {
                            case "Load":
                              return <span>Load ⬆️</span>;
                            case "Unload":
                              return <span>Unload ⬇️</span>;
                            default:
                              return null;
                          }
                        })()}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(truck_station);
                  break;
                case "Space Elevator":
                  popupContent = () => (
                    <Paper
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      elevation={1}
                    >
                      <Typography variant="h2" gutterBottom>
                        Name: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Fully Upgraded: {getGeo[i].FullyUpgraded ? "✅" : "❌"}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Upgrade Ready: {getGeo[i].UpgradeReady ? "✅" : "❌"}
                      </Typography>
                    </Paper>
                  );
                  marker.setIcon(space_elevator);
                  break;
              }
              const popup = new Popup().setContent(
                ReactDOMServer.renderToString(popupContent() || <></>)
              );
              popup.options.offset = new Point(32, 25);
              marker.bindPopup(popup);
              layerGroup.addLayer(marker);
            } catch {
              return;
            }
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            alert.value = { error: true, message: `Error fetching: ${url}` };
          }
        }
      };

      const mfspeedString = localStorage.getItem("mfspeed");
      const delay = mfspeedString ? parseInt(mfspeedString) : 2500;

      const newIntervalId = setInterval(() => {
        fetchData();
      }, delay);

      return () => {
        cancelTokenSource.cancel();
        clearInterval(newIntervalId);
      };
    });

    return null;
  }

  function MainMap() {
    map.value = useMap();
    try {
      mapImg.addTo(map.value);
      playerGroup.addTo(map.value);
      droneGroup.addTo(map.value);
      droneStationGroup.addTo(map.value);
      trainGroup.addTo(map.value);
      trainStationGroup.addTo(map.value);
      vehicleGroup.addTo(map.value);
      radarTowerGroup.addTo(map.value);
      powerSlugGroup.addTo(map.value);
      truckStationGroup.addTo(map.value);
      spaceElevatorGroup.addTo(map.value);
    } catch {
      return null; // ignore the errors they are harmless
    }
    return null;
  }

  function handleZoom(type) {
    type == "+"
      ? map.value.setZoom(map.value.getZoom() + 1)
      : map.value.setZoom(map.value.getZoom() - 1);
  }

  function ZoomCtrl() {
    return (
      <Box
        sx={{
          top: 10,
          left: 10,
          position: "absolute",
        }}
      >
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
          variant="contained"
        >
          <Button
            id="+"
            onClick={() => {
              handleZoom("+");
            }}
          >
            <Add />
          </Button>
          <Button
            id="-"
            onClick={() => {
              handleZoom("-");
            }}
          >
            <Remove />
          </Button>
        </ButtonGroup>
      </Box>
    );
  }

  function handleLayer(e) {
    const layer = e.target.name;
    const enabled = e.target.checked;
    switch (layer) {
      case "playerGroup":
        enabled
          ? playerGroup.addTo(map.value)
          : playerGroup.removeFrom(map.value);
        break;
      case "droneGroup":
        enabled
          ? droneGroup.addTo(map.value)
          : droneGroup.removeFrom(map.value);
        break;
      case "droneStationGroup":
        enabled
          ? droneStationGroup.addTo(map.value)
          : droneStationGroup.removeFrom(map.value);
        break;
      case "trainGroup":
        enabled
          ? trainGroup.addTo(map.value)
          : trainGroup.removeFrom(map.value);
        break;
      case "trainStationGroup":
        enabled
          ? trainStationGroup.addTo(map.value)
          : trainStationGroup.removeFrom(map.value);
        break;
      case "vehicleGroup":
        enabled
          ? vehicleGroup.addTo(map.value)
          : vehicleGroup.removeFrom(map.value);
        break;
      case "radarTowerGroup":
        enabled
          ? radarTowerGroup.addTo(map.value)
          : radarTowerGroup.removeFrom(map.value);
        break;
      case "powerSlugGroup":
        enabled
          ? powerSlugGroup.addTo(map.value)
          : powerSlugGroup.removeFrom(map.value);
        break;
      case "truckStationGroup":
        enabled
          ? truckStationGroup.addTo(map.value)
          : truckStationGroup.removeFrom(map.value);
        break;
      case "spaceElevatorGroup":
        enabled
          ? spaceElevatorGroup.addTo(map.value)
          : spaceElevatorGroup.removeFrom(map.value);
    }
  }

  function LayerCtrl() {
    return (
      <Box
        sx={{
          top: 10,
          right: 10,
          position: "absolute",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            open.value = !open.value;
          }}
        >
          <Layers />
        </Button>

        <Card
          sx={{
            position: "absolute",
            right: 0,
          }}
          hidden={!open.value}
        >
          <List>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="playerGroup"
                    color="primary"
                  />
                }
                label="Player"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="droneGroup"
                    color="primary"
                  />
                }
                label="Drone"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="droneStationGroup"
                    color="primary"
                  />
                }
                label="Drone Station"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="trainGroup"
                    color="primary"
                  />
                }
                label="Train"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="trainStationGroup"
                    color="primary"
                  />
                }
                label="Train Station"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="vehicleGroup"
                    color="primary"
                  />
                }
                label="Vehicle"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="radarTowerGroup"
                    color="primary"
                  />
                }
                label="Radar Tower"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="powerSlugGroup"
                    color="primary"
                  />
                }
                label="Power Slug"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="truckStationGroup"
                    color="primary"
                  />
                }
                label="Truck Station"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    onClick={handleLayer}
                    name="spaceElevatorGroup"
                    color="primary"
                  />
                }
                label="Space Elevator"
              />
            </ListItem>
          </List>
        </Card>
      </Box>
    );
  }

  return (
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
      <ZoomCtrl />
      <LayerCtrl />
      <PopupWrapper>
        <MapContainer
          minZoom={-10}
          maxZoom={18}
          zoom={-13}
          center={[0, 0]}
          crs={CRS.Simple}
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            left: 0,
            zIndex: -1,
            background: "#121212",
            overflow: "hidden",
          }}
          zoomControl={false}
        >
          <MainMap />
          <RealtimeLayerLoader
            url="/getPlayer"
            type="Player"
            layerGroup={playerGroup}
          />
          <RealtimeLayerLoader
            url="/getDrone"
            type="Drone"
            layerGroup={droneGroup}
          />
          <RealtimeLayerLoader
            url="/getDroneStation"
            type="Drone Station"
            layerGroup={droneStationGroup}
          />
          <RealtimeLayerLoader
            url="/getTrains"
            type="Trains"
            layerGroup={trainGroup}
          />
          <RealtimeLayerLoader
            url="/getTrainStation"
            type="Train Stations"
            layerGroup={trainStationGroup}
          />
          <RealtimeLayerLoader
            url="/getVehicles"
            type="Vehicles"
            layerGroup={vehicleGroup}
          />
          <RealtimeLayerLoader
            url="/getRadarTower"
            type="Radar Tower"
            layerGroup={radarTowerGroup}
          />
          <RealtimeLayerLoader
            url="/getPowerSlug"
            type="Power Slug"
            layerGroup={powerSlugGroup}
          />
          <RealtimeLayerLoader
            url="/getTruckStation"
            type="Truck Station"
            layerGroup={truckStationGroup}
          />
          <RealtimeLayerLoader
            url="/getSpaceElevator"
            type="Space Elevator"
            layerGroup={spaceElevatorGroup}
          />
        </MapContainer>
      </PopupWrapper>
    </Container>
  );
}

export default Map;
