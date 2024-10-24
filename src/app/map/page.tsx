"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapElement = dynamic(() => import("@/app/utils/map"), { ssr: false });

export default function Map() {
  const [layers, setLayers] = useState<any>([]);

  useEffect(() => {
    const { LayerGroup } = require("leaflet");
    setLayers([
      {
        name: "playerG",
        label: "Players",
        url: "getPlayer",
        enabled: true,
        iconURL: "/img/Map/player.png",
        group: new LayerGroup(),
      },
      {
        name: "vehiclesG",
        label: "Vehicles",
        url: "getVehicles",
        enabled: true,
        iconURL: "/img/Map/tractor.png",
        group: new LayerGroup(),
      },
      {
        name: "truckstationG",
        label: "Truck Station",
        url: "getTruckStation",
        enabled: true,
        iconURL: "/img/Map/truck_station.png",
        group: new LayerGroup(),
      },
      {
        name: "droneG",
        label: "Drone",
        url: "getDrone",
        enabled: true,
        iconURL: "/img/Map/drone.png",
        group: new LayerGroup(),
      },
      {
        name: "dronestationG",
        label: "Drone Station",
        url: "getDroneStation",
        enabled: true,
        iconURL: "/img/Map/drone_station.png",
        group: new LayerGroup(),
      },
      {
        name: "trainsG",
        label: "Trains",
        url: "getTrains",
        enabled: true,
        iconURL: "/img/Map/train.png",
        group: new LayerGroup(),
      },
      {
        name: "trainstationsG",
        label: "Train Stations",
        url: "getTrainStation",
        enabled: true,
        iconURL: "/img/Map/train_station.png",
        group: new LayerGroup(),
      },
      {
        name: "radartowerG",
        label: "Radar Tower",
        url: "getRadarTower",
        enabled: true,
        iconURL: "/img/Map/radar_tower.png",
        group: new LayerGroup(),
      },
      {
        name: "powerslugG",
        label: "Power Slug",
        url: "getPowerSlug",
        enabled: false,
        iconURL: "/img/Map/power_slug.png",
        group: new LayerGroup(),
      },
      {
        name: "spaceelevatorG",
        label: "Space Elevator",
        url: "getSpaceElevator",
        enabled: true,
        iconURL: "/img/Map/space_elevator.png",
        group: new LayerGroup(),
      },
    ]);
  }, []);

  if (layers.length === 0) return null;

  return <MapElement l={layers} />;
}
