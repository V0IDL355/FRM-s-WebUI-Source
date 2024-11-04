"use client";

import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {images} from "@/../public/images";

const MapElement = dynamic(() => import("@/app/utils/map"), {ssr: false});

export default function Map() {
    const [layers, setLayers] = useState<any>([]);

    useEffect(() => {
        const {LayerGroup} = require("leaflet");
        setLayers([{
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.player,
            label: "Players",
            name: "player",
            url: "getPlayer",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.truck,
            label: "Vehicles",
            name: "vehicles",
            url: "getVehicles",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.truck_station,
            label: "Truck Station",
            name: "truck-station",
            url: "getTruckStation",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.drone,
            label: "Drone",
            name: "drone",
            url: "getDrone",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.drone_station,
            label: "Drone Station",
            name: "drone-station",
            url: "getDroneStation",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.train,
            label: "Trains",
            name: "trains",
            url: "getTrains",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.train_station,
            label: "Train Stations",
            name: "train-stations",
            url: "getTrainStation",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.radar_tower,
            label: "Radar Tower",
            name: "radar-tower",
            url: "getRadarTower",
        }, {
            enabled: false,
            group: new LayerGroup(),
            iconURL: images.map.power_slug,
            label: "Power Slug",
            name: "power-slug",
            url: "getPowerSlug",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.space_elevator,
            label: "Space Elevator",
            name: "space-elevator",
            url: "getSpaceElevator",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.drop_pod,
            label: "Drop Pod",
            name: "drop-pod",
            url: "getDropPod",
        }, {
            enabled: true,
            group: new LayerGroup(),
            iconURL: images.map.question_mark,
            label: "Resource Node",
            name: "resource-node",
            url: "getResourceNode",
        }, {
            enabled: false,
            group: new LayerGroup(),
            iconURL: images.map.question_mark,
            label: "Resource Geyser",
            name: "resource-geyser",
            url: "getResourceGeyser",
        }, {
            enabled: false,
            group: new LayerGroup(),
            iconURL: images.map.question_mark,
            label: "Resource Well",
            name: "resource-well",
            url: "getResourceWell",
        }]);
    }, []);

    if (layers.length === 0) return null;

    return <MapElement l={layers}/>;
}
