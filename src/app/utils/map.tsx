"use client";
import { signal } from "@preact/signals-react";
import { CRS, Icon, LatLng, LayerGroup, Marker, Popup } from "leaflet";
import { ImageOverlay, MapContainer, useMap } from "react-leaflet";
import { v5 as uuidv5 } from "uuid";
import { api, mdelay } from "./api";
import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "@/app/css/leaflet.css";
import { CircleCheck, CircleX, Layers } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { renderToString } from "react-dom/server";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Layer {
  group: LayerGroup;
  name: string;
  label: string;
  enabled: boolean;
  url: string;
  iconURL: string;
}

const map = signal<any>(null);

function InitMap() {
  map.value = useMap();

  return <></>;
}

const MapElement: React.FC<{ l: Layer[] }> = ({ l }) => {
  const [layers, setLayers] = useState<Layer[]>(l);
  const [markers, setMarkers] = useState<any>([]);

  useEffect(() => {
    const intervals: any = [];
    l.forEach((layer: Layer) => {
      const interval = setInterval(async () => {
        try {
          if (!layer.enabled) {
            return;
          }
          const result: Array<any> = (await api.get(layer.url)).data;
          result.forEach((res) => {
            if (res == null) {
              return;
            }
            const lat = res.location.y * -1;
            const lon = res.location.x;
            const markerLocation = new LatLng(lat, lon);

            let id: string = res["ID"];
            let iconUrl = layer.iconURL;

            let popup: any;
            switch (layer.url) {
              case "getPlayer":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>Player: {res["Name"] || "Offline"}</CardTitle>
                    </CardHeader>
                  </Card>
                );
                iconUrl = res["Dead"]
                  ? "/img/Map/player_dead.png"
                  : "/img/Map/player.png";
                break;
              case "getVehicles":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ textAlign: "center" }}>
                        {res["Name"]}
                      </CardTitle>
                      <CardDescription>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                          <li>Current Gear: {res["CurrentGear"]}</li>
                          <li>Forward Speed: {res["ForwardSpeed"]}</li>
                          <li>Engine RPM: {res["EngineRPM"]}</li>
                          <li>Throttle Percent: {res["ThrottlePercent"]}</li>
                        </ul>
                        <Separator />
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                          <li>
                            <div className="flex items-center">
                              AutoPilot:{" "}
                              {res["AutoPilot"] ? (
                                <CircleCheck className="h-4 w-4 mr-1" />
                              ) : (
                                <CircleX className="h-4 w-4 mr-1" />
                              )}
                            </div>
                          </li>
                          <li>Path Name: {res["PathName"]}</li>
                          <li>
                            <div className="flex items-center">
                              {" "}
                              Following Path:{" "}
                              {res["FollowingPath"] ? (
                                <CircleCheck className="h-4 w-4 mr-1" />
                              ) : (
                                <CircleX className="h-4 w-4 mr-1" />
                              )}
                            </div>
                          </li>
                        </ul>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                switch (res["ClassName"]) {
                  case "BP_Truck_C":
                    iconUrl = "/img/Map/truck.png";
                    break;
                  case "BP_Tractor_C":
                    iconUrl = "/img/Map/tractor.png";
                    break;
                  default:
                    iconUrl = "/img/Map/explorer.png";
                    break;
                }
                break;
              case "getTruckStation":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>{res["Name"]}</CardTitle>
                      <CardDescription>
                        <p>LoadMode: WIP</p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                id =
                  res["location"]["x"] +
                  res["location"]["y"] +
                  res["location"]["z"];
                break;
              case "getDrone":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>{res["Name"]}</CardTitle>
                      <CardDescription>
                        <p>Destination: {res["CurrentDestination"]}</p>
                        <p>Flying Speed: {Math.round(res["FlyingSpeed"])}</p>
                        <p className="flex items-center">
                          Flying:{" "}
                          {Math.round(res["FlyingSpeed"]) > 0 ? (
                            <CircleCheck className="h-4 w-4 mr-1" />
                          ) : (
                            <CircleX className="h-4 w-4 mr-1" />
                          )}
                        </p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                break;
              case "getDroneStation":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>{res["Name"]}</CardTitle>
                      <CardDescription>
                        <p> Paired Station: {res["PairedStation"]}</p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                id =
                  res["location"]["x"] +
                  res["location"]["y"] +
                  res["location"]["z"];
                break;
              case "getTrains":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {res["Name"]} | {res["Status"]}
                      </CardTitle>
                      <CardDescription>
                        <p>Speed: {res["ForwardSpeed"]}</p>
                        <p>Train Station: {res["TrainStation"]}</p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                break;
              case "getTrainStation":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>{res["Name"]}</CardTitle>
                    </CardHeader>
                  </Card>
                );
                id =
                  res["location"]["x"] +
                  res["location"]["y"] +
                  res["location"]["z"];
                break;
              case "getRadarTower":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>{res["Name"]}</CardTitle>
                      <CardDescription>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                          <li>X: {res.location["x"]}</li>
                          <li>Y: {res.location["y"]}</li>
                          <li>Z: {res.location["z"]}</li>
                        </ul>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                id =
                  res["location"]["x"] +
                  res["location"]["y"] +
                  res["location"]["z"];
                break;
              case "getPowerSlug":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle
                        style={{
                          color: {
                            BP_Crystal_C: "#277ead",
                            BP_Crystal_mk2_C: "#cc6f26",
                            BP_Crystal_mk3_C: "#ba32cc",
                          }[res["ClassName"] as string],
                        }}
                      >
                        {
                          {
                            BP_Crystal_C: "Slug Type: MK1",
                            BP_Crystal_mk2_C: "Slug Type: MK2",
                            BP_Crystal_mk3_C: "Slug Type: MK3",
                          }[res["ClassName"] as string]
                        }
                      </CardTitle>
                      <CardDescription>
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                          <li>X: {res.location["x"]}</li>
                          <li>Y: {res.location["y"]}</li>
                          <li>Z: {res.location["z"]}</li>
                        </ul>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                break;
              case "getSpaceElevator":
                popup = (
                  <Card>
                    <CardHeader>
                      <CardTitle>{res["Name"]}</CardTitle>
                      <CardDescription>
                        <p className="flex items-center">
                          Fully Upgraded:{" "}
                          {res["FullyUpgraded"] ? (
                            <CircleCheck className="h-4 w-4 mr-1" />
                          ) : (
                            <CircleX className="h-4 w-4 mr-1" />
                          )}
                        </p>
                        <p className="flex items-center">
                          Upgrade Ready:{" "}
                          {res["UpgradeReady"] ? (
                            <CircleCheck className="h-4 w-4 mr-1" />
                          ) : (
                            <CircleX className="h-4 w-4 mr-1" />
                          )}
                        </p>
                        <p>Z: {res.location["Z"]}</p>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
                id =
                  res["location"]["x"] +
                  res["location"]["y"] +
                  res["location"]["z"];
                break;
            }

            const markerId = uuidv5(String(id), uuidv5.URL);

            if (!markers[layer.url]) {
              setMarkers((prevMarkers: any) => ({
                ...prevMarkers,
                [layer.url]: [],
              }));
            }

            let marker: Marker = !!markers[layer.url][markerId]
              ? markers[layer.url][markerId]
              : new Marker(markerLocation);
            popup = renderToString(popup || <></>);
            if (!markers[layer.url][markerId]) {
              marker.addTo(layer.group);
              marker.bindPopup(
                new Popup({
                  closeButton: false,
                }).setContent(popup),
              );
            } else if (!!markers[layer.url][markerId]) {
              marker.getPopup()?.setContent(popup);
            }
            marker?.setLatLng(markerLocation);
            marker?.getPopup()?.setLatLng(markerLocation);
            marker?.setIcon(
              new Icon({
                iconUrl: iconUrl,
                iconSize: [32, 32],
                shadowUrl: undefined,
              }),
            );
            setMarkers((prevMarkers: any) => ({
              ...prevMarkers,
              [layer.url]: { ...prevMarkers[layer.url], [markerId]: marker },
            }));
            console.log(markers[layer.url][markerId]);
          });
        } catch (e) {
          console.error(e);
        }
      }, mdelay);
      intervals.push(interval);
    });
    return () => {
      intervals.forEach((id: NodeJS.Timeout | any) => clearInterval(id));
    };
  });
  return (
    <div>
      <Popover>
        <PopoverTrigger
          style={{
            left: "50%",
            position: "absolute",
            zIndex: 2,
            marginTop: 5,
          }}
        >
          <Button variant="outline">
            <Layers className="mr-2 h-4 w-4" /> Layers
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-3 m-2">
            {layers.map((layer: Layer, index: number) => {
              return (
                <Toggle
                  key={index + layer.label}
                  defaultPressed={layer.enabled}
                  onPressedChange={(pressed) => {
                    layer.enabled = pressed;
                    layer.enabled
                      ? layer.group.addTo(map.value)
                      : layer.group.removeFrom(map.value);
                    setLayers([...l]);
                  }}
                  pressed={layer.enabled}
                  style={{ gap: 5 }}
                >
                  <Avatar style={{ height: 32, width: 32 }}>
                    <AvatarImage src={layer.iconURL} />
                    <AvatarFallback>{layer.label}</AvatarFallback>
                  </Avatar>
                  {layer.label}
                </Toggle>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <MapContainer
        minZoom={-10}
        maxZoom={18}
        zoom={-10}
        center={[0, 0]}
        crs={CRS.Simple}
        layers={l.map((layer: Layer) => {
          return layer.group;
        })}
        zoomControl={false}
        boxZoom={false}
        style={{
          height: "100%",
          width: "100%",
          position: "fixed",
          backgroundColor: "transparent",
          overflow: "hidden",
          borderRadius: 10,
          padding: 25,
        }}
      >
        <ImageOverlay
          url={"/img/Map/map.png"}
          bounds={[
            [-375e3, -324698.832031],
            [375e3, 425301.832031],
          ]}
          zIndex={-1}
        />
        <InitMap />
      </MapContainer>
    </div>
  );
};

export default MapElement;
