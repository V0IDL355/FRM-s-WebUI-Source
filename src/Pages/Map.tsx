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
} from "leaflet";
import React from "react";
import Typography from "@mui/material/Typography/Typography";
import Box from "@mui/material/Box/Box";
import ReactDOMServer from "react-dom/server";
import * as Icons from "@mui/icons-material";
import ButtonGroup from "@mui/material/ButtonGroup/ButtonGroup";
import Button from "@mui/material/Button/Button";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import Card from "@mui/material/Card/Card";
import ListItem from "@mui/material/ListItem/ListItem";
import List from "@mui/material/List/List";
import CardContent from "@mui/material/CardContent/CardContent";
import api from "../Utils/api";
import { Snackbar, Alert, Container } from "@mui/material";
import axios from "axios";

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

const bounds: L.LatLngBoundsExpression = [
  [-375e3, -324698.832031],
  [375e3, 425301.832031],
];

function Map() {
  const [map, setMap] = React.useState<any>(null);
  const [error, setError] = React.useState<boolean>(false);
  const [alertText, setAlertText] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  function RealtimeLayerLoader({
    url,
    type,
    layerGroup,
  }: {
    url: string;
    type: string;
    layerGroup: L.LayerGroup;
  }) {
    React.useEffect(() => {
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
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Player: {getGeo[i].PlayerName}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Ping Time: {getGeo[i].PingTime} ms
                      </Typography>
                    </Box>
                  );

                  if (getGeo[i].Dead) {
                    marker.setIcon(player_dead);
                  } else {
                    marker.setIcon(player);
                  }
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
                        Derailed: {getGeo[i].Derailed.toString()}
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
                        AutoPilot: {getGeo[i].AutoPilot.toString()}
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
                    <Box>
                      <Typography variant="h2" gutterBottom>
                        Name: {getGeo[i].Name}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Fully Upgraded: {getGeo[i].FullyUpgraded.toString()}
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        Upgrade Ready: {getGeo[i].UpgradeReady.toString()}
                      </Typography>
                    </Box>
                  );
                  marker.setIcon(space_elevator);
                  break;
              }
              const markerOptions = { autoClose: false };
              const popup = new Popup(markerOptions).setContent(
                ReactDOMServer.renderToString(popupContent() || <></>)
              );
              marker.bindPopup(popup);
              layerGroup.addLayer(marker);
            } catch {
              return;
            }
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            setError(true);
            setAlertText(`Error fetching: ${url}`);
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
    }, [url, type, layerGroup]);

    return null;
  }

  const layer = imageOverlay("/img/Map/map.png", bounds);

  function MainMap() {
    const usedMap = useMap();
    setMap(usedMap);
    layer.addTo(map);
    playerGroup.addTo(map);
    playerGroup.addTo(map);
    droneGroup.addTo(map);
    droneStationGroup.addTo(map);
    trainGroup.addTo(map);
    trainStationGroup.addTo(map);
    vehicleGroup.addTo(map);
    radarTowerGroup.addTo(map);
    powerSlugGroup.addTo(map);
    truckStationGroup.addTo(map);
    spaceElevatorGroup.addTo(map);
    return null;
  }

  function handleZoom(type) {
    type == "+"
      ? map.setZoom(map.getZoom() + 1)
      : map.setZoom(map.getZoom() - 1);
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
            <Icons.Add />
          </Button>
          <Button
            id="-"
            onClick={() => {
              handleZoom("-");
            }}
          >
            <Icons.Remove />
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
        enabled ? playerGroup.addTo(map) : playerGroup.removeFrom(map);
        break;
      case "droneGroup":
        enabled ? droneGroup.addTo(map) : droneGroup.removeFrom(map);
        break;
      case "droneStationGroup":
        enabled
          ? droneStationGroup.addTo(map)
          : droneStationGroup.removeFrom(map);
        break;
      case "trainGroup":
        enabled ? trainGroup.addTo(map) : trainGroup.removeFrom(map);
        break;
      case "trainStationGroup":
        enabled
          ? trainStationGroup.addTo(map)
          : trainStationGroup.removeFrom(map);
        break;
      case "vehicleGroup":
        enabled ? vehicleGroup.addTo(map) : vehicleGroup.removeFrom(map);
        break;
      case "radarTowerGroup":
        enabled ? radarTowerGroup.addTo(map) : radarTowerGroup.removeFrom(map);
        break;
      case "powerSlugGroup":
        enabled ? powerSlugGroup.addTo(map) : powerSlugGroup.removeFrom(map);
        break;
      case "truckStationGroup":
        enabled
          ? truckStationGroup.addTo(map)
          : truckStationGroup.removeFrom(map);
        break;
      case "spaceElevatorGroup":
        enabled
          ? spaceElevatorGroup.addTo(map)
          : spaceElevatorGroup.removeFrom(map);
    }
  }

  function LayerCtrl() {
    const handleClick = () => {
      setOpen(!open);
    };

    return (
      <Box
        sx={{
          top: 10,
          right: 10,
          position: "absolute",
        }}
      >
        <Button variant="contained" onClick={handleClick}>
          <Icons.Layers></Icons.Layers>
        </Button>

        <Card
          sx={{
            position: "absolute",
            right: 0,
          }}
          hidden={!open}
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
      <ZoomCtrl />
      <LayerCtrl />
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
    </Container>
  );
}

export default Map;
