/* eslint-disable @typescript-eslint/no-explicit-any */
import {Container} from "@mui/material";
import MapElement, {Layer} from "../Utils/map";
import {createLayer} from "../Utils/utils";

const tempLayers: Layer[] = [
  createLayer({
    name: "playerG",
    label: "Players",
    enabled: true,
    url: "getPlayer",
  }),
  createLayer({
    name: "trainsG",
    label: "Trains",
    enabled: true,
    url: "getTrains",
  }),
  createLayer({
    name: "vehiclesG",
    label: "Vehicles",
    enabled: true,
    url: "getVehicles",
  }),
  createLayer({
    name: "droneG",
    label: "Drone",
    enabled: true,
    url: "getDrone",
  }),
  createLayer({
    name: "dronestationG",
    label: "Drone Station",
    enabled: true,
    url: "getDroneStation",
  }),
  createLayer({
    name: "trainstationsG",
    label: "Train Stations",
    enabled: true,
    url: "getTrainStation",
  }),
  createLayer({
    name: "radartowerG",
    label: "Radar Tower",
    enabled: true,
    url: "getRadarTower",
  }),
  createLayer({
    name: "powerslugG",
    label: "Power Slug",
    enabled: true,
    url: "getPowerSlug",
  }),
  createLayer({
    name: "truckstationG",
    label: "Truck Station",
    enabled: true,
    url: "getTruckStation",
  }),
  createLayer({
    name: "spaceelevatorG",
    label: "Space Elevator",
    enabled: true,
    url: "getSpaceElevator",
  }),
];

export default function MainMap() {
  return (
    <Container>
      <MapElement layers={tempLayers} />
    </Container>
  );
}
