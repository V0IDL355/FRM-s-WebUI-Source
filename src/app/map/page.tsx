"use client";

import MapElement, { Layer } from "@/app/utils/map";
import { LayerGroup } from "leaflet";

const layers = [
  {
    name: "playerG",
    label: "Players",
    url: "getPlayer",
    enabled: true,
    iconURL: "/img/Map/player.png",
  },
  {
    name: "vehiclesG",
    label: "Vehicles",
    url: "getVehicles",
    enabled: true,
    iconURL: "/img/Map/tractor.png",
  },
  {
    name: "truckstationG",
    label: "Truck Station",
    url: "getTruckStation",
    enabled: true,
    iconURL: "/img/Map/truck_station.png",
  },
  {
    name: "droneG",
    label: "Drone",
    url: "getDrone",
    enabled: true,
    iconURL: "/img/Map/drone.png",
  },
  {
    name: "dronestationG",
    label: "Drone Station",
    url: "getDroneStation",
    enabled: true,
    iconURL: "/img/Map/drone_station.png",
  },
  {
    name: "trainsG",
    label: "Trains",
    url: "getTrains",
    enabled: true,
    iconURL: "/img/Map/train.png",
  },
  {
    name: "trainstationsG",
    label: "Train Stations",
    url: "getTrainStation",
    enabled: true,
    iconURL: "/img/Map/train_station.png",
  },
  {
    name: "radartowerG",
    label: "Radar Tower",
    url: "getRadarTower",
    enabled: true,
    iconURL: "/img/Map/radar_tower.png",
  },
  {
    name: "powerslugG",
    label: "Power Slug",
    url: "getPowerSlug",
    enabled: true,
    iconURL: "/img/Map/power_slug.png",
  },
  {
    name: "spaceelevatorG",
    label: "Space Elevator",
    url: "getSpaceElevator",
    enabled: true,
    iconURL: "/img/Map/space_elevator.png",
  },
];

function createLayer({
  name,
  label,
  enabled,
  url,
  iconURL,
}: {
  name: string;
  label: string;
  enabled: boolean;
  url: string;
  iconURL: string;
}): Layer {
  return {
    group: new LayerGroup(),
    name: name,
    label: label,
    enabled: enabled,
    url: url,
    iconURL: iconURL,
  };
}

export default function Map() {
  return (
    <div>
      <MapElement
        layers={layers.map((layer: any) => {
          return createLayer(layer);
        })}
      />
    </div>
  );
}
