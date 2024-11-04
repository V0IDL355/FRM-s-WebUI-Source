"use client";
import {signal} from "@preact/signals-react";
import {CRS, DivIcon, LatLng, LayerGroup, Marker, Popup} from "leaflet";
import {ImageOverlay, MapContainer, useMap} from "react-leaflet";
import {v5 as uuidv5} from "uuid";
import {api, mdelay} from "@/lib/api";
import React, {useEffect, useState} from "react";
import {Card, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import "@/app/css/leaflet.css";
import {Check, CircleCheck, CircleX, Layers, X, Zap} from "lucide-react";
import {Toggle} from "@/components/ui/toggle";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {images} from "@public/images";
import {renderToString} from "react-dom/server";
import {Badge} from "@/components/ui/badge";

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

const CircleConnector = ({imageUrl, className, innerColor}: {
    imageUrl: string, className: string, innerColor: string
}) => {
    const markerColor = "29.33, 58.19%, 64.51%"
    return (<div className="absolute left-[-50%]">
        <div className="relative">
            <svg
                className="absolute pointer-events-none size-[200px] bottom-[-50px] left-[-60px]"
                style={{zIndex: -1}}
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    x1={16} y1={50}
                    x2={70} y2={145}
                    stroke={`hsl(${markerColor})`}
                    strokeWidth={3}
                />
            </svg>

            <div className="size-[16px] rounded-full" style={{
                backgroundColor: `hsl(${markerColor})`
            }}/>

            <div
                className="size-[70px] rounded-full absolute top-[-100px] left-[-70px] flex items-center justify-center border-[2px] bg-card"
                style={{
                    borderColor: `hsl(${markerColor})`
                }}
            >
                <div className="size-[60px] rounded-full p-[5px] border" style={{
                    backgroundColor: `hsla(${innerColor}, 0.5)`, borderColor: `hsl(${innerColor})`
                }}>
                    <img src={imageUrl} alt={className} className={"size-full"}/>
                </div>
            </div>
        </div>
    </div>);


};

const MapElement: React.FC<{ l: Layer[] }> = ({l}) => {
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

                        let marker_color = "229deg, 13%, 52%"

                        switch (layer.url) {
                            case "getPlayer":
                                popup = (<CardHeader>
                                    <CardTitle>Player: {res["Name"] || "Offline"}</CardTitle>
                                </CardHeader>);
                                iconUrl = res["Dead"] ? images.map.player_dead : (res["Online"] as boolean) ? images.map.player : images.map.player_offline;
                                break;
                            case "getVehicles":
                                popup = (<CardHeader>
                                    <CardTitle style={{textAlign: "center"}}>
                                        {res["Name"]}
                                    </CardTitle>
                                    <CardDescription>
                                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                                            <li>Current Gear: {res["CurrentGear"]}</li>
                                            <li>Forward Speed: {res["ForwardSpeed"]}</li>
                                            <li>Engine RPM: {res["EngineRPM"]}</li>
                                            <li>Throttle Percent: {res["ThrottlePercent"]}</li>
                                        </ul>
                                        <Separator/>
                                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                                            <li>
                                                <div className="flex items-center">
                                                    AutoPilot:{" "}
                                                    {res["AutoPilot"] ? (<CircleCheck className="h-4 w-4 mr-1"/>) : (
                                                        <CircleX className="h-4 w-4 mr-1"/>)}
                                                </div>
                                            </li>
                                            <li>Path Name: {res["PathName"]}</li>
                                            <li>
                                                <div className="flex items-center">
                                                    {" "}
                                                    Following Path:{" "}
                                                    {res["FollowingPath"] ? (
                                                        <CircleCheck className="h-4 w-4 mr-1"/>) : (
                                                        <CircleX className="h-4 w-4 mr-1"/>)}
                                                </div>
                                            </li>
                                        </ul>
                                    </CardDescription>
                                </CardHeader>);

                                iconUrl = {
                                    BP_Golfcart_C: images.map.factory_cart,
                                    BP_Tractor_C: images.map.tractor,
                                    BP_Truck_C: images.map.truck,
                                }[res["ClassName"] as string] ?? images.map.explorer;
                                break;
                            case "getTruckStation":
                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]}</CardTitle>
                                    <CardDescription>
                                        <p>LoadMode: WIP</p>
                                    </CardDescription>
                                </CardHeader>);
                                id = res["location"]["x"] + res["location"]["y"] + res["location"]["z"];
                                break;
                            case "getDrone":
                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]}</CardTitle>
                                    <CardDescription>
                                        <p>Destination: {res["CurrentDestination"]}</p>
                                        <p>Flying Speed: {Math.round(res["FlyingSpeed"])}</p>
                                        <p className="flex items-center">
                                            Flying:{" "}
                                            {Math.round(res["FlyingSpeed"]) > 0 ? (
                                                <CircleCheck className="h-4 w-4 mr-1"/>) : (
                                                <CircleX className="h-4 w-4 mr-1"/>)}
                                        </p>
                                    </CardDescription>
                                </CardHeader>);
                                break;
                            case "getDroneStation":
                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]}</CardTitle>
                                    <CardDescription>
                                        <p> Paired Station: {res["PairedStation"]}</p>
                                    </CardDescription>
                                </CardHeader>);
                                id = res["location"]["x"] + res["location"]["y"] + res["location"]["z"];
                                break;
                            case "getTrains":
                                popup = (<CardHeader>
                                    <CardTitle>
                                        {res["Name"]} | {res["Status"]}
                                    </CardTitle>
                                    <CardDescription>
                                        <p>Speed: {res["ForwardSpeed"]}</p>
                                        <p>Train Station: {res["TrainStation"]}</p>
                                    </CardDescription>
                                </CardHeader>);
                                break;
                            case "getTrainStation":
                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]}</CardTitle>
                                </CardHeader>);
                                id = res["location"]["x"] + res["location"]["y"] + res["location"]["z"];
                                break;
                            case "getRadarTower":
                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]}</CardTitle>
                                </CardHeader>);
                                id = res["location"]["x"] + res["location"]["y"] + res["location"]["z"];
                                break;
                            case "getPowerSlug":
                                let slug_color = {
                                    BP_Crystal_C: "200, 61%, 42%",
                                    BP_Crystal_mk2_C: "26, 69%, 48%",
                                    BP_Crystal_mk3_C: "288, 61%, 50%",
                                }[res["ClassName"] as string];

                                popup = (<CardHeader>
                                    <div className={"inline-flex items-center gap-1"}>
                                        <CardTitle>Slug</CardTitle>

                                        <Badge
                                            style={{
                                                backgroundColor: `hsla(${slug_color}, 0.2)`,
                                                borderColor: `hsl(${slug_color})`,
                                                color: `hsl(${slug_color})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            className={`w-full justify-center border`}
                                            variant={"outline"}
                                        >
                                            {{
                                                BP_Crystal_C: "MK1", BP_Crystal_mk2_C: "MK2", BP_Crystal_mk3_C: "MK3",
                                            }[res["ClassName"] as string]}
                                        </Badge>
                                    </div>
                                </CardHeader>);
                                iconUrl = {
                                    BP_Crystal_C: images.map.power_slug_mk1,
                                    BP_Crystal_mk2_C: images.map.power_slug_mk2,
                                    BP_Crystal_mk3_C: images.map.power_slug_mk3,
                                }[res["ClassName"] as string] ?? images.map.power_slug;
                                break;
                            case "getSpaceElevator":
                                let fully_upgraded_color = res["FullyUpgraded"] ? "96deg, 44%, 68%" : "359deg, 68%, 71%";
                                let upgrade_ready_color = res["UpgradeReady"] ? "96deg, 44%, 68%" : "359deg, 68%, 71%";

                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]}</CardTitle>
                                    <CardDescription>
                                        <Badge
                                            style={{
                                                backgroundColor: `hsla(${fully_upgraded_color}, 0.2)`,
                                                borderColor: `hsl(${fully_upgraded_color})`,
                                                color: `hsl(${fully_upgraded_color})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            className={"w-full justify-center border relative inline-flex"}
                                            variant={"outline"}
                                        >
                                            {res["FullyUpgraded"] ? <Check className="size-4 absolute left-[5px]"/> :
                                                <X className="size-4 absolute left-[5px]"/>}
                                            {res["FullyUpgraded"] ? "Fully Upgraded 🎉" : "Not Fully Upgraded"}
                                        </Badge>
                                        <Badge
                                            style={{
                                                backgroundColor: `hsla(${upgrade_ready_color}, 0.2)`,
                                                borderColor: `hsl(${upgrade_ready_color})`,
                                                color: `hsl(${upgrade_ready_color})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            className={"w-full justify-center border relative inline-flex"}
                                            variant={"outline"}
                                        >
                                            {res["UpgradeReady"] ? <Check className="size-4 absolute left-[5px]"/> :
                                                <X className="size-4 absolute left-[5px]"/>}
                                            {res["UpgradeReady"] ? "Upgrade Ready" : "Upgrade Not Ready"}
                                        </Badge>
                                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                                            {res["CurrentPhase"].map((item: {
                                                Name: string,
                                                ClassName: string,
                                                Amount: number,
                                                RemainingCost: number,
                                                TotalCost: number
                                            }) => (

                                                <li key={item.ClassName + res["ID"]}>{item.Name} {item.Amount}/{item.TotalCost}</li>))}
                                        </ul>
                                    </CardDescription>
                                </CardHeader>);
                                break;
                            case "getDropPod":
                                let looted_color = res["Looted"] ? "96deg, 44%, 68%" : "359deg, 68%, 71%";
                                popup = (<CardHeader>
                                    <CardTitle>Drop Pod</CardTitle>
                                    <CardDescription>
                                        <div className={"gap-1 flex items-center flex-col"}>
                                            {res["RepairItem"] != "No Item" || (res["RepairAmount"] !== 0 && (<Badge
                                                style={{
                                                    backgroundColor: "hsla(227deg, 17%, 58%, 0.2)",
                                                    borderColor: "hsl(227deg, 17%, 58%)",
                                                    color: "hsl(227deg, 17%, 58%)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                className={"w-full justify-center border"}
                                                variant={"outline"}
                                            >
                                                {res["RepairItem"]} {res["RepairAmount"]}
                                            </Badge>))}

                                            {res["PowerRequired"] !== 0 && (<Badge
                                                style={{
                                                    backgroundColor: "hsla(40deg, 62%, 73%, 0.2)",
                                                    borderColor: "hsl(40deg, 62%, 73%)",
                                                    color: "hsl(40deg, 62%, 73%)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                className={"w-full justify-center border relative"}
                                                variant={"outline"}
                                            >
                                                <Zap className="size-4 absolute left-[5px]"/>
                                                {res["PowerRequired"]}
                                            </Badge>)}

                                            <Badge
                                                style={{
                                                    backgroundColor: `hsla(${looted_color}, 0.2)`,
                                                    borderColor: `hsl(${looted_color})`,
                                                    color: `hsl(${looted_color})`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                className={"w-full justify-center border relative inline-flex"}
                                                variant={"outline"}
                                            >
                                                {res["Looted"] ? <Check className="size-4 absolute left-[5px]"/> :
                                                    <X className="size-4 absolute left-[5px]"/>}
                                                {res["Looted"] ? "Looted" : "Not Looted"}
                                            </Badge>
                                        </div>
                                    </CardDescription>
                                </CardHeader>);
                                marker_color = looted_color
                                break;
                            case "getResourceNode":
                                let node_purity_color = {
                                    Pure: "96deg, 44%, 68%", Normal: "20deg, 79%, 70%", Impure: "359deg, 68%, 71%"
                                }[res["Purity"] as string] ?? "229deg, 13%, 52%";
                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]} Resource Node</CardTitle>
                                    <CardDescription>
                                        <Badge
                                            style={{
                                                backgroundColor: `hsla(${node_purity_color}, 0.2)`,
                                                borderColor: `hsl(${node_purity_color})`,
                                                color: `hsl(${node_purity_color})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            className={"w-full justify-center border relative inline-flex"}
                                            variant={"outline"}
                                        >
                                            {res["Purity"]}
                                        </Badge>
                                    </CardDescription>
                                </CardHeader>);
                                iconUrl = `${images.resources.path + res["ClassName"]}.png`
                                marker_color = node_purity_color
                                break;

                            // case "getResourceGeyser":
                            //     popup = (<CardHeader>
                            //         <CardTitle>{res["Name"]} Resource Geyser</CardTitle>
                            //         <CardDescription>
                            //             <Badge
                            //                 style={{
                            //                     backgroundColor: `hsla(${purity_color}, 0.2)`,
                            //                     borderColor: `hsl(${purity_color})`,
                            //                     color: `hsl(${purity_color})`,
                            //                     display: "flex",
                            //                     alignItems: "center",
                            //                     justifyContent: "center",
                            //                 }}
                            //                 className={"w-full justify-center border relative inline-flex"}
                            //                 variant={"outline"}
                            //             >
                            //                 {res["Purity"]}
                            //             </Badge>
                            //         </CardDescription>
                            //     </CardHeader>);
                            //     break
                            case "getResourceWell":
                                let well_purity_color = {
                                    Pure: "96deg, 44%, 68%", Normal: "20deg, 79%, 70%", Impure: "359deg, 68%, 71%"
                                }[res["Purity"] as string] ?? "229deg, 13%, 52%";
                                popup = (<CardHeader>
                                    <CardTitle>{res["Name"]} Resource Geyser</CardTitle>
                                    <CardDescription>
                                        <Badge
                                            style={{
                                                backgroundColor: `hsla(${well_purity_color}, 0.2)`,
                                                borderColor: `hsl(${well_purity_color})`,
                                                color: `hsl(${well_purity_color})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            className={"w-full justify-center border relative inline-flex"}
                                            variant={"outline"}
                                        >
                                            {res["Purity"]}
                                        </Badge>
                                    </CardDescription>
                                </CardHeader>);
                                iconUrl = `${images.resources.path + res["ClassName"]}.png`
                                marker_color = well_purity_color
                                break
                        }

                        const markerId = uuidv5(String(id), uuidv5.URL);

                        popup = renderToString(<Card key={markerId + "-popup"}>{popup}</Card>,);

                        if (!markers[layer.url]) {
                            setMarkers((prevMarkers: any) => ({
                                ...prevMarkers, [layer.url]: [],
                            }));
                        }


                        let marker: Marker = !!markers[layer.url][markerId] ? markers[layer.url][markerId] : new Marker(markerLocation);
                        if (!markers[layer.url][markerId]) {
                            marker.addTo(layer.group);
                            marker.bindPopup(new Popup({
                                closeButton: false,
                            }).setContent(popup),);
                        } else if (!!markers[layer.url][markerId]) {
                            marker.getPopup()?.setContent(popup);
                        }
                        marker?.setLatLng(markerLocation);
                        marker?.getPopup()?.setLatLng(markerLocation);
                        marker?.setIcon(new DivIcon({
                            html: renderToString(<CircleConnector imageUrl={iconUrl} className={res["ClassName"]}
                                                                  innerColor={marker_color}/>), className: undefined
                        }));
                        setMarkers((prevMarkers: any) => ({
                            ...prevMarkers, [layer.url]: {...prevMarkers[layer.url], [markerId]: marker},
                        }));
                    });
                } catch (e) {
                    // console.error(e);
                }
            }, mdelay);
            intervals.push(interval);
        });
        return () => {
            intervals.forEach((id: NodeJS.Timeout | any) => clearInterval(id));
        };
    });
    return (<div>
        <Popover>
            <PopoverTrigger
                style={{
                    left: "50%", position: "absolute", zIndex: 2, marginTop: 5,
                }}
            >
                <Button variant="outline" asChild>
                    <div>
                        <Layers className="mr-2 h-4 w-4"/> Layers
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="grid gap-3 m-2">
                    {layers.map((layer: Layer, index: number) => {
                        return (<Toggle
                            key={index + layer.label}
                            defaultPressed={layer.enabled}
                            onPressedChange={(pressed) => {
                                layer.enabled = pressed;
                                layer.enabled ? layer.group.addTo(map.value) : layer.group.removeFrom(map.value);
                                setLayers([...l]);
                            }}
                            pressed={layer.enabled}
                            style={{gap: 5}}
                        >
                            <Avatar style={{height: 32, width: 32}}>
                                <AvatarImage src={layer.iconURL}/>
                                <AvatarFallback>{layer.label}</AvatarFallback>
                            </Avatar>
                            {layer.label}
                        </Toggle>);
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
                url={images.map.map}
                bounds={[[-375e3, -324698.832031], [375e3, 425301.832031],]}
                zIndex={-1}
            />
            <InitMap/>
        </MapContainer>
    </div>);
};

export default MapElement;
