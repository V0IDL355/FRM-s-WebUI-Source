"use client";
import {baseURL} from "@/lib/api";
import React, {useCallback, useEffect, useState} from "react";
import {Layers} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {map, misc, power_slugs, resources} from "@public/images";
import {Badge} from "@/components/ui/badge";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import DeckGL, {
    BitmapLayer, COORDINATE_SYSTEM, IconLayer, LineLayer, OrthographicView, PickingInfo, PolygonLayer,
} from "deck.gl";
import {Building, buildings} from "@/lib/buildings";
import {makePopup} from "@/components/map/popup";
import {Toggle} from "@/components/ui/toggle";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const MAP_VIEW = new OrthographicView({
    id: "2d-scene", flipY: false, controller: {
        dragRotate: false,
    },
});

const makeElement = (key: any, val: any, count: number, t?: string) => {
    let color = {
        pure: "96deg,44%,68%",
        normal: "20deg,79%,70%",
        impure: "359deg,68%,71%",
        mk1: "200,61%,42%",
        mk2: "26,69%,48%",
        mk3: "288,61%,50%",
    }[t as string] ?? "229deg,13%,52%";

    return (<div
        key={key}
        className="border items-center justify-center flex-col p-2 rounded-2xl inline-flex gap-1"
        style={{
            backgroundColor: `hsla(${color}, 0.5)`, borderColor: `hsl(${color})`,
        }}
    >
        <img src={val.icon} alt={key} className="size-[50px]  top-[10px]"/>
        <Badge
            className={" left-0 right-0 bottom-[-10px] backdrop-blur-md bg-white/10 text-white border hover:bg-white/5 transition-all duration-700 text-center justify-center"}
            style={{borderColor: `hsl(${color})`}}
        >
            {count}
        </Badge>
    </div>);
};

const renderCounts = (obj: any): any => {
    return Object.entries(obj).flatMap(([key1, value1]: [string, any]) => Object.entries(value1).flatMap(([key2, value2]: [string, any]) => {
        return (<div
            className={"w-full flex gap-2 justify-center flex-wrap"}
            key={key1 + key2}
        >
            {Array.isArray(value2) ? value2.map((finalVal) => makeElement(finalVal.key, finalVal, finalVal.count, finalVal.key,),) : typeof value2.count === "object" ? Object.entries(value2.count).map(([purityKey, purityResource]: [string, any]) => makeElement(key2 + purityKey, value2, purityResource, purityKey,),) : makeElement(key2, value2, value2.count)}
        </div>);
    }),);
};

const whatWasIgnored = (array: any[], whitelist: string[], ignore_list_well: string[] = [],) => array
    .filter((node) => !whitelist.includes(node["ClassName"]))
    .filter((node) => !ignore_list_well.includes(node["ClassName"]))
    .filter((node, index, self) => self.findIndex((t) => t["ClassName"] === node["ClassName"]) === index,);

function getSize(location: { x: number; y: number; z: number; rotation: number }, building: Building,) {
    let width = building.length * 100;
    let length = building.width * 100;

    let x = location.x;
    let y = location.y * -1;
    let rotation = location.rotation;

    const points = [[x - width / 2, y + length / 2], [x + width / 2, y + length / 2], [x + width / 2, y - length / 2], [x - width / 2, y - length / 2],];

    const radians = (rotation * Math.PI) / 180;

    function rotatePoint(px: number, py: number) {
        const rotatedX = x + (px - x) * Math.cos(radians) - (py - y) * Math.sin(radians);
        const rotatedY = y + (px - x) * Math.sin(radians) + (py - y) * Math.cos(radians);
        return [rotatedX, rotatedY];
    }

    return points.map((point) => rotatePoint(point[0], point[1]));
}

const MapElement: React.FC = () => {
    const [dataVersion, setDataVersion] = useState<number>(0);

    useEffect(() => {
        const nextUpdate = setTimeout(() => setDataVersion(dataVersion + 1), 1000);
        return () => clearTimeout(nextUpdate);
    }, [dataVersion]);

    const mapImg = new BitmapLayer({
        id: "bitmap-layer", image: map, bounds: [-375e3 + 50301.83203125, -375e3, 375e3 + 50301.83203125, 375e3],
    });

    const layers = [new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getHUBTerminal?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70, url: misc.hub, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "hub",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getRadarTower?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                url: misc.radar_tower, width: 70, height: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "radio_tower",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getTrainStation?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70, url: misc.vehicles.trains.train_station, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "train_station",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getTrains?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70, url: misc.vehicles.trains.train, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "train",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getDroneStation?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70, url: misc.drones.drone_station, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "drone_station",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getDrone?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70, url: misc.drones.drone, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "drone",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getTruckStation?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70, url: misc.vehicles.trucks.truck_station, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "truck_station",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getSpaceElevator?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70,
                url: d["FullyUpgraded"] || d["UpgradeReady"] ? misc.space_elevator.space_elevator_ready : misc.space_elevator.space_elevator,
                width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "space_elevator",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getPlayer?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                url: d["Dead"] ? misc.player.player_dead : (d["Online"] as boolean) ? misc.player.alive : misc.player.player_offline,
                width: 70,
                height: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "players",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getVehicles?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                height: 70, url: {
                    BP_Golfcart_C: misc.vehicles.factory_cart,
                    BP_Tractor_C: misc.vehicles.tractor,
                    BP_Truck_C: misc.vehicles.trucks.truck,
                }[d["ClassName"] as string] ?? misc.vehicles.explorer, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "vehicles",
        pickable: true,
        visible: true,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getPowerSlug?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                url: {
                    BP_Crystal_C: power_slugs.power_slug_mk1,
                    BP_Crystal_mk2_C: power_slugs.power_slug_mk2,
                    BP_Crystal_mk3_C: power_slugs.power_slug_mk3,
                }[d["ClassName"] as string] ?? misc.question_mark, width: 70, height: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "slug",
        pickable: true,
        visible: false,
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: `${baseURL}getDropPod?v=${dataVersion}`,
        getIcon: (d) => {
            return {
                url: d["Looted"] ? misc.drop_pod.drop_pod_collected : misc.drop_pod.drop_pod, width: 70, height: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "drop_pod",
        pickable: true,
        visible: true,
    }), new LineLayer({
        pickable: true,
        id: "cables",
        data: `${baseURL}getCables?v=${dataVersion}`,

        getColor: (d) => [0, 122, 255],
        getSourcePosition: (d) => [d["location0"].x, d["location0"].y * -1],
        getTargetPosition: (d) => [d["location1"].x, d["location1"].y * -1],
        getWidth: 2,
        visible: true,
    }), new PolygonLayer({
        data: `${baseURL}getFactory?v=${dataVersion}`, getFillColor: (d: any) => {
            if ((d["ClassName"] as string).includes("Smelter")) return new Uint8Array(buildings.smelter.color);
            if ((d["ClassName"] as string).includes("Assembler")) return new Uint8Array(buildings.assembler.color);
            if ((d["ClassName"] as string).includes("Constructor")) return new Uint8Array(buildings.constructor.color);
            if ((d["ClassName"] as string).includes("Manufacturer")) return new Uint8Array(buildings.manufacturer.color);
            if ((d["ClassName"] as string).includes("HadronCollider")) return new Uint8Array(buildings.particle_accelerator.color);
            if ((d["ClassName"] as string).includes("Packager")) return new Uint8Array(buildings.packager.color);
            if ((d["ClassName"] as string).includes("Refinery")) return new Uint8Array(buildings.refinery.color);
            if ((d["ClassName"] as string).includes("Converter")) return new Uint8Array(buildings.converter.color);
            if ((d["ClassName"] as string).includes("Foundry")) return new Uint8Array(buildings.foundry.color);
            return [100, 100, 100, 100];
        }, getLineColor: [41, 44, 60],

        getLineWidth: 20, getPolygon: (d) => {
            if ((d["ClassName"] as string).includes("Assembler")) return getSize(d.location, buildings.assembler);
            if ((d["ClassName"] as string).includes("Constructor")) return getSize(d.location, buildings.constructor);
            if ((d["ClassName"] as string).includes("Smelter")) return getSize(d.location, buildings.smelter);
            if ((d["ClassName"] as string).includes("Manufacturer")) return getSize(d.location, buildings.manufacturer);
            if ((d["ClassName"] as string).includes("HadronCollider")) return getSize(d.location, buildings.particle_accelerator);
            if ((d["ClassName"] as string).includes("Packager")) return getSize(d.location, buildings.packager);
            if ((d["ClassName"] as string).includes("Refinery")) return getSize(d.location, buildings.refinery);
            if ((d["ClassName"] as string).includes("Converter")) return getSize(d.location, buildings.converter);
            if ((d["ClassName"] as string).includes("Foundry")) return getSize(d.location, buildings.foundry);
            return getSize(d.location, {
                width: 2, length: 2, color: [100, 100, 100, 100],
            });
        }, id: "factory", lineWidthMinPixels: 1, pickable: true, visible: true,
    }), new PolygonLayer({
        data: `${baseURL}getGenerators?v=${dataVersion}`, getFillColor: (d: any) => {
            if ((d["ClassName"] as string).includes("Coal")) return new Uint8Array(buildings.coal_generator.color);
            if ((d["ClassName"] as string).includes("GeneratorBiomass")) return new Uint8Array(buildings.biomass_generator.color);
            if ((d["ClassName"] as string).includes("IntegratedBiomass")) return new Uint8Array(buildings.biomass_generator_integrated.color);
            if ((d["ClassName"] as string).includes("Fuel")) return new Uint8Array(buildings.fuel_generator.color);
            if ((d["ClassName"] as string).includes("Nuclear")) return new Uint8Array(buildings.nuclear_generator.color);
            return [100, 100, 100, 100];
        }, getLineColor: [41, 44, 60],

        getLineWidth: 20, getPolygon: (d) => {
            if ((d["ClassName"] as string).includes("Coal")) return getSize(d.location, buildings.coal_generator);
            if ((d["ClassName"] as string).includes("GeneratorBiomass")) return getSize(d.location, buildings.biomass_generator);
            if ((d["ClassName"] as string).includes("IntegratedBiomass")) return getSize(d.location, buildings.biomass_generator_integrated);
            if ((d["ClassName"] as string).includes("Fuel")) return getSize(d.location, buildings.fuel_generator);
            if ((d["ClassName"] as string).includes("Nuclear")) return getSize(d.location, buildings.nuclear_generator);
            return getSize(d.location, {
                color: [100, 100, 100, 100], length: 2, width: 2,
            });
        }, id: "generators", lineWidthMinPixels: 1, pickable: true, visible: true,
    })];

    const no_update_layers = [new IconLayer({
        pickable: true,
        id: "resource_well",
        getPosition: (d: any) => {
            return [d.location.x, d.location.y * -1];
        },
        getIcon: (d) => {
            return {
                url: d["ClassName"] ? `${resources + d["ClassName"]}/${d["Purity"].toLowerCase()}.png` : misc.question_mark,
                width: 70,
                height: 70,
            };
        },
        data: `${baseURL}getResourceWell?v=${dataVersion}`,
        getSize: 70,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        visible: false,
    }), new IconLayer({
        pickable: true,
        id: "resource_node",
        getPosition: (d: any) => {
            return [d.location.x, d.location.y * -1];
        },
        getIcon: (d) => {
            return {
                url: d["ClassName"] ? `${resources + d["ClassName"]}/${d["Purity"].toLowerCase()}.png` : misc.question_mark,
                width: 70,
                height: 70,
            };
        },
        data: `${baseURL}getResourceNode?v=${dataVersion}`,
        getSize: 70,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        visible: true,
    })];

    let nyaa = [...layers, ...no_update_layers]

    return (<div>
        <Sheet>
            <SheetTrigger
                asChild
                style={{
                    left: "50%", position: "absolute", zIndex: 2, marginTop: 5,
                }}
            >
                <Button variant="outline" asChild>
                    <div>
                        <Layers className="mr-2 h-4 w-4"/> Layers NEW
                    </div>
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
                <ScrollArea className={"h-[90vh]"}>
                    <SheetHeader>
                        <SheetTitle>Layers & Filters</SheetTitle>
                        <SheetDescription>
                            <div className={"gap-2 flex flex-col"}>
                                {nyaa.map((meow, index: number) => {

                                    return (<Toggle
                                        key={index + meow.id}
                                        defaultPressed={meow.props.visible}
                                        onPressedChange={(pressed) => {
                                            // @ts-ignore
                                            nyaa[index] = meow.clone({visible: pressed})
                                            console.log(nyaa[index].id, meow.id, pressed, meow.props.visible)
                                        }}
                                        pressed={meow.props.visible}
                                        style={{gap: 5}}
                                        className={"bg-[hsla(29,75%,65%,0.5)] data-[state=on]:bg-[hsla(29,75%,65%,0.7)] border border-[hsl(29,75%,65%)] text-white w-full"}
                                    >
                                        <Avatar style={{height: 32, width: 32}}>
                                            <AvatarImage src={misc.question_mark}/>
                                            <AvatarFallback>{meow.id}</AvatarFallback>
                                        </Avatar>
                                        {meow.id}
                                    </Toggle>);
                                })}
                            </div>

                            <Separator className="my-[15px]"/>
                            <div className={"gap-2 flex-col flex w-full"}>
                                {/*{renderCounts(filters)}*/}
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </ScrollArea>
            </SheetContent>
        </Sheet>

        <DeckGL
            layers={[mapImg, ...nyaa]}
            views={MAP_VIEW}
            initialViewState={{
                target: [0, 0, 0], zoom: -10, maxZoom: 18, minZoom: -10,
            }}
            style={{
                height: "100%", width: "100%", position: "fixed", backgroundColor: "transparent", overflow: "hidden",
            }}
            getTooltip={useCallback(({object, layer}: PickingInfo) => {
                return (object && {
                    html: makePopup(layer?.id, object), style: {
                        backgroundColor: "transparent",
                    },
                });
            }, [])}
        />
    </div>);
};

export default MapElement;
