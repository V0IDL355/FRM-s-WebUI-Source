/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@mui/material";
import MapElement, { Layer } from "../Utils/map";
import { createLayer } from "../Utils/utils";

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
];

export default function MainMap() {
  return (
    <Container>
      <MapElement layers={tempLayers} />
    </Container>
  );
}
