/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Layers, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { signal, useSignalEffect } from "@preact/signals-react";
import {
  CRS,
  Icon,
  LatLng,
  LayerGroup,
  Marker,
  Popup,
  imageOverlay,
} from "leaflet";
import ReactDOMServer from "react-dom/server";
import { MapContainer, useMap } from "react-leaflet";
import styled from "styled-components";
import { v5 as uuidv5 } from "uuid";
import { api, mdelay } from "./api";
import { theme } from "./theme";
const map = signal<any>(null);
const layers = signal<any>(null);
const open = signal(false);
export interface Layer {
  group: LayerGroup;
  name: string;
  label: string;
  enabled: boolean;
  url: string;
}

function Controls() {
  function Zoom() {
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
              map.value.setZoom(map.value.getZoom() + 1);
            }}
          >
            <Add />
          </Button>
          <Button
            id="-"
            onClick={() => {
              map.value.setZoom(map.value.getZoom() - 1);
            }}
          >
            <Remove />
          </Button>
        </ButtonGroup>
      </Box>
    );
  }
  function generateLayerMap() {
    return Object.values(layers.value).map((layer) => {
      const fixedLayer = layer as Layer;

      return (
        <ListItem key={fixedLayer.name}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={true}
                name={fixedLayer.name}
                color="primary"
                onChange={(e) => {
                  fixedLayer.enabled = e.target.checked;
                  fixedLayer.enabled
                    ? fixedLayer.group.addTo(map.value)
                    : fixedLayer.group.removeFrom(map.value);
                }}
              />
            }
            label={fixedLayer.label}
          />
        </ListItem>
      );
    });
  }
  function Layer() {
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
          <List>{generateLayerMap()}</List>
        </Card>
      </Box>
    );
  }
  return (
    <Container>
      <Zoom />
      <Layer />
    </Container>
  );
}

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
  & .leaflet-popup-content-wrapper {
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

function InitMap() {
  map.value = useMap();
  mapImg.addTo(map.value);

  return <></>;
}

const markers = signal<any>([]);

const UpdateMapData = (urls) => {
  useSignalEffect(() => {
    const intervals: any = [];
    urls.forEach((url) => {
      const layer = layers.value.find((layer) => {
        if (layer.url === url) {
          return true;
        }
      }) as Layer;
      const fetchData = async () => {
        try {
          if (!layer.enabled) {
            return;
          }
          const result: Array<any> = await api.get(url);
          result.forEach((res) => {
            if (res == null) {
              return;
            }
            const lat = (res.location.y | res.location.Y) * -1;
            const lon = res.location.x | res.location.X;
            const markerLocation = new LatLng(lat, lon);

            let popupContent: () => JSX.Element | null = () => (
              <Card>
                <CardContent>
                  <Typography variant="h2" gutterBottom>
                    Sample Text
                  </Typography>
                </CardContent>
              </Card>
            );

            let id = "";
            let iconUrl = "";
            switch (url) {
              case "getPlayer":
                popupContent = () => (
                  <Paper>
                    <Typography variant="h2" gutterBottom>
                      Player:{" "}
                      {res.PlayerName ? res.PlayerName : "Unknown/Offline"}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Ping Time:{" "}
                      {res.PlayerName ? res.PingTime : "Unknown/Offline"} ms
                    </Typography>
                  </Paper>
                );
                id = res.ID;
                iconUrl = res.Dead
                  ? "/img/Map/player_dead.png"
                  : "/img/Map/player.png";
                break;
              case "getDrone":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Destination: {res.CurrentDestination}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Flying Speed: {Math.round(res.FlyingSpeed)}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Flying: {Math.round(res.FlyingSpeed) > 0 ? "✅" : "❌"}
                    </Typography>
                  </Box>
                );
                iconUrl = "/img/Map/drone.png";
                break;
              case "getTrains":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Train Name: {res.Name}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Speed: {res.ForwardSpeed}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Derailed: {res.Derailed ? "✅" : "❌"}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Train Station: {res.TrainStation}
                    </Typography>
                  </Box>
                );
                id = res.Name;
                iconUrl = "/img/Map/train.png";
                break;
              case "getVehicles":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Vehicle Type: {res.Name}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      AutoPilot: {res.AutoPilot ? "✅" : "❌"}
                    </Typography>
                  </Box>
                );

                switch (res.Name) {
                  case "Explorer":
                    iconUrl = "/img/Map/explorer.png";
                    break;
                  case "Truck":
                    iconUrl = "/img/Map/truck.png";
                    break;
                  case "Tractor":
                    iconUrl = "/img/Map/tractor.png";
                    break;
                  default:
                    iconUrl = "/img/Map/explorer.png";
                    break;
                }
                break;
              case "getDroneStation":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Name: {res.Name}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Paired Station: {res.PairedStation}
                    </Typography>
                  </Box>
                );
                iconUrl = "/img/Map/drone_station.png";
                break;
              case "getTrainStation":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Name: {res.Name}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      LoadingStatus:{" "}
                      {(() => {
                        switch (res.LoadingStatus) {
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
                        switch (res.LoadingMode) {
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
                iconUrl = "/img/Map/train_station.png";
                break;
              case "getRadarTower":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Name: {res.Name}
                    </Typography>
                    <Typography variant="h3">X: {res.location.X}</Typography>
                    <Typography variant="h3">Y: {res.location.Y}</Typography>
                    <Typography variant="h3">Z: {res.location.Z}</Typography>
                  </Box>
                );
                iconUrl = "/img/Map/radar_tower.png";
                break;
              case "getPowerSlug":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Slug Type: {res.SlugType}
                    </Typography>
                    <Typography variant="h3">
                      X: {res.features.geometry.coordinates.X}
                    </Typography>
                    <Typography variant="h3">
                      Y: {res.features.geometry.coordinates.Y}
                    </Typography>
                    <Typography variant="h3">
                      Z: {res.features.geometry.coordinates.Z}
                    </Typography>
                  </Box>
                );
                id = res.ID;
                iconUrl = `/img/Map/${String(res.ClassName).replace(
                  "BP",
                  "Desc"
                )}.png`;
                break;
              case "getTruckStation":
                popupContent = () => (
                  <Box>
                    <Typography variant="h2" gutterBottom>
                      Name: {res.Name}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      LoadMode:{" "}
                      {(() => {
                        switch (res.LoadMode) {
                          case "Loading":
                            return <span>Loading ⬆️</span>;
                          case "Unloading":
                            return <span>Unloading ⬇️</span>;
                          default:
                            return null;
                        }
                      })()}
                    </Typography>
                  </Box>
                );
                iconUrl = "/img/Map/truck_station.png";
                break;
              case "getSpaceElevator":
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
                      Name: {res.Name}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Fully Upgraded: {res.FullyUpgraded ? "✅" : "❌"}
                    </Typography>
                    <Typography variant="h3" gutterBottom>
                      Upgrade Ready: {res.UpgradeReady ? "✅" : "❌"}
                    </Typography>
                  </Paper>
                );
                iconUrl = "/img/Map/space_elevator.png";
                break;
            }
            id = uuidv5(String(id), uuidv5.URL);

            if (!markers.value[url]) {
              markers.value[url] = [];
            }
            if (!markers.value[url][id]) {
              const marker = (markers.value[url][id] = new Marker(
                markerLocation
              ));
              marker.setIcon(new Icon({ iconUrl: iconUrl }));
              marker.addTo(layer.group);
              marker.bindPopup(
                new Popup().setContent(
                  ReactDOMServer.renderToString(popupContent() || <></>)
                )
              );
            } else if (markers.value[url][id]) {
              const marker = markers.value[url][id] as Marker;
              marker.getPopup()?.setLatLng(markerLocation);
              marker
                .getPopup()
                ?.setContent(
                  ReactDOMServer.renderToString(popupContent() || <></>)
                );
              marker.setLatLng(markerLocation);
              marker.setIcon(
                new Icon({ iconUrl: iconUrl, iconSize: [32, 32] })
              );
            }
          });
        } catch {
          ("");
        }
      };

      const interval = setInterval(() => {
        fetchData();
      }, mdelay.value);
      intervals.push(interval);
    });
    return () => {
      intervals.forEach((id) => clearInterval(id));
      Object.values(layers.value).map((layer) => {
        const l = layer as Layer;
        l.enabled = true;
      });
    };
  });
};

export default function MapElement(clayers) {
  layers.value = clayers["layers"];
  const lg = layers.value.map((layer) => {
    return layer.group;
  });
  UpdateMapData(
    layers.value.map((layer) => {
      return layer.url;
    })
  );
  return (
    <Container>
      <Controls />
      <PopupWrapper>
        <MapContainer
          minZoom={-10}
          maxZoom={18}
          zoom={-13}
          center={[0, 0]}
          crs={CRS.Simple}
          layers={lg}
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
          <InitMap />
        </MapContainer>
      </PopupWrapper>
    </Container>
  );
}
