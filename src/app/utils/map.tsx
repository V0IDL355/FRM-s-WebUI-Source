"use client";
import {baseURL} from "@/lib/api";
import React, {useCallback, useEffect, useState} from "react";
import {Check, Layers, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {map, misc, normal, power_slugs, resources} from "@public/images";
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
import {Separator} from "@/components/ui/separator";

const MAP_VIEW = new OrthographicView({
    id: "2d-scene", flipY: false, controller: {
        dragRotate: false,
    },
});

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

const layerStuff = {
    player: {
        icon: normal.player.alive, label: "Players"
    }, hub: {
        icon: normal.hub, label: "Hub"
    }, radar: {
        icon: normal.radar_tower, label: "Radio Towers"
    }, train: {
        icon: normal.vehicles.trains.train, label: "Trains"
    }, train_station: {
        icon: normal.vehicles.trains.train_station, label: "Train Stations"
    }, drone: {
        icon: normal.drones.drone, label: "Drones"
    }, drone_station: {
        icon: normal.drones.drone_station, label: "Drone Stations"
    }, truck_station: {
        icon: normal.vehicles.trucks.truck_station, label: "Truck Stations"
    }, space: {
        icon: normal.space_elevator, label: "Space Elevator"
    }, vehicles: {
        icon: normal.vehicles.trucks.truck, label: "Vehicles"
    }, slugs: {
        icon: power_slugs.power_slug, label: "Slug"
    }, cables: {
        icon: normal.power, label: "Cables"
    }, factory: {
        icon: normal.question_mark, label: "Factory"
    }, generators: {
        icon: normal.power, label: "Power Generators"
    }, drop: {
        icon: normal.drop_pod, label: "Drop Pods"
    }, resource_well: {
        icon: normal.question_mark, label: "Resource Wells"
    }, resource_node: {
        icon: normal.question_mark, label: "Resource Nodes"
    }
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

    const [nyaa_slug_filters, setSlugFilters] = useState<string[]>([])
    const [nyaa_resource_filters, setResourceFilters] = useState<string[]>([])

    const [nyaa, setUwU] = useState<{
        [key: string]: {
            visible: boolean; id: string; filters?: string[];
        };
    }>({
        player: {
            visible: false, filters: [], id: "players"
        }, hub: {
            visible: false, id: "hub"
        }, radar: {
            visible: false, id: "radio_tower"
        }, train: {
            visible: false, id: "train"
        }, train_station: {
            visible: false, id: "train_station"
        }, drone: {
            visible: false, id: "drone"
        }, drone_station: {
            visible: false, id: "drone_station"
        }, truck_station: {
            visible: false, id: "truck_station"
        }, space: {
            visible: false, id: "space_elevator"
        }, vehicles: {
            visible: false, filters: [], id: "vehicles"
        }, slugs: {
            visible: false, filters: nyaa_slug_filters, id: "slug"
        }, cables: {
            visible: false, id: "cables"
        }, factory: {
            visible: false, id: "factory"
        }, generators: {
            visible: false, id: "generators"
        }, drop: {
            visible: false, id: "drop_pod"
        }, resource_well: {
            visible: true, filters: nyaa_resource_filters, id: "resource_well"
        }, resource_node: {
            visible: false, filters: nyaa_resource_filters, id: "resource_node"
        }
    })

    useEffect(() => {
        setUwU((prevNyaa) => ({
            ...prevNyaa,
            slugs: {...prevNyaa.slugs, filters: nyaa_slug_filters},
            resource_well: {...prevNyaa.resource_well, filters: nyaa_resource_filters},
            resource_node: {...prevNyaa.resource_node, filters: nyaa_resource_filters},
        }));
    }, [nyaa_resource_filters, nyaa_slug_filters]);

    const [data, setData] = useState({
        player: {
            url: "getPlayer", data: []
        }, hub: {
            url: "getHUBTerminal", data: []
        }, radar: {
            url: "getRadarTower", data: []
        }, train: {
            url: "getTrains", data: []
        }, train_station: {
            url: "getTrainStation", data: []
        }, drone: {
            url: "getDrone", data: []
        }, drone_station: {
            url: "getDroneStation", data: []
        }, truck_station: {
            url: "getTruckStation", data: []
        }, space: {
            url: "getSpaceElevator", data: []
        }, vehicles: {
            url: "getVehicles", data: []
        }, slugs: {
            url: "getPowerSlug", data: []
        }, cables: {
            url: "getCables", data: []
        }, factory: {
            url: "getFactory", data: []
        }, generators: {
            url: "getGenerators", data: []
        }, drop: {
            url: "getDropPod", data: []
        }, resource_well: {
            url: "getResourceWell", data: []
        }, resource_node: {
            url: "getResourceNode", data: []
        },
    })

    useEffect(() => {
        const nextUpdate = setInterval(() => {
            Object.entries(data).forEach(async ([key, endpoint]) => {
                const nyaaEntry = nyaa[key];
                if (!nyaaEntry?.visible) return;

                const filters = nyaaEntry.filters;

                const response = await fetch(baseURL + endpoint.url);
                const rawData = await response.json();

                const filteredData = rawData.filter((item: any) => {
                    if (!filters || filters.length === 0) return true;
                    return filters.includes(item["ClassName"]) || filters.includes(`${item["ClassName"]}-${item["Purity"]}`);
                });

                setData((prevData) => ({
                    ...prevData, [key]: {
                        ...endpoint, data: filteredData
                    }
                }));
            });
        }, 1000);

        return () => clearInterval(nextUpdate);
    }, [nyaa, nyaa_resource_filters, nyaa_slug_filters]);

    const master = [new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.hub.data,
        getIcon: (d) => {
            return {
                height: 70, url: misc.hub, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "hub",
        pickable: true,
        visible: nyaa.hub.visible,
        updateTriggers: {
            visible: nyaa.hub.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.radar.data,
        getIcon: (d) => {
            return {
                url: misc.radar_tower, width: 70, height: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "radio_tower",
        pickable: true,
        visible: nyaa.radar.visible,
        updateTriggers: {
            visible: nyaa.radar.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.train_station.data,
        getIcon: (d) => {
            return {
                height: 70, url: misc.vehicles.trains.train_station, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "train_station",
        pickable: true,
        visible: nyaa.train_station.visible,
        updateTriggers: {
            visible: nyaa.train_station.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.train.data,
        getIcon: (d) => {
            return {
                height: 70, url: misc.vehicles.trains.train, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "train",
        pickable: true,
        visible: nyaa.train.visible,
        updateTriggers: {
            visible: nyaa.train.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.drone_station.data,
        getIcon: (d) => {
            return {
                height: 70, url: misc.drones.drone_station, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "drone_station",
        pickable: true,
        visible: nyaa.drone_station.visible,
        updateTriggers: {
            visible: nyaa.drone_station.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.drone.data,
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
        updateTriggers: {
            visible: nyaa.hub.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.truck_station.data,
        getIcon: (d) => {
            return {
                height: 70, url: misc.vehicles.trucks.truck_station, width: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "truck_station",
        pickable: true,
        visible: nyaa.truck_station.visible,
        updateTriggers: {
            visible: nyaa.truck_station.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.space.data,
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
        visible: nyaa.space.visible,
        updateTriggers: {
            visible: nyaa.space.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.player.data,
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
        visible: nyaa.player.visible,
        updateTriggers: {
            visible: nyaa.player.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.vehicles.data,
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
        visible: nyaa.vehicles.visible,
        updateTriggers: {
            visible: nyaa.vehicles.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.slugs.data,
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
        visible: nyaa.slugs.visible,
        updateTriggers: {
            visible: nyaa.slugs.visible
        }
    }), new IconLayer({
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.drop.data,
        getIcon: (d) => {
            return {
                url: d["Looted"] ? misc.drop_pod.drop_pod_collected : misc.drop_pod.drop_pod, width: 70, height: 70,
            };
        },
        getPosition: (d: any) => [d.location.x, d.location.y * -1],
        getSize: 70,
        id: "drop_pod",
        pickable: true,
        visible: nyaa.drop.visible,
        updateTriggers: {
            visible: nyaa.drop.visible
        }
    }), new LineLayer({
        pickable: true,
        id: "cables",
        data: data.cables.data,

        getColor: (d) => [0, 122, 255],
        getSourcePosition: (d) => [d["location0"].x, d["location0"].y * -1],
        getTargetPosition: (d) => [d["location1"].x, d["location1"].y * -1],
        getWidth: 2,
        visible: nyaa.cables.visible,
        updateTriggers: {
            visible: nyaa.cables.visible
        }
    }), new PolygonLayer({
        data: data.factory.data, getFillColor: (d: any) => {
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
        }, id: "factory", lineWidthMinPixels: 1, pickable: true, visible: nyaa.factory.visible, updateTriggers: {
            visible: nyaa.factory.visible
        }
    }), new PolygonLayer({
        data: data.generators.data, getFillColor: (d: any) => {
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
        }, id: "generators", lineWidthMinPixels: 1, pickable: true, visible: nyaa.generators.visible, updateTriggers: {
            visible: nyaa.generators.visible
        }
    }), new IconLayer({
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
        data: data.resource_well.data,
        getSize: 70,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        visible: nyaa.resource_well.visible,
        updateTriggers: {
            visible: nyaa.resource_well.visible
        }
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
        data: data.resource_node.data,
        getSize: 70,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        visible: nyaa.resource_node.visible,
        updateTriggers: {
            visible: nyaa.resource_node.visible
        }
    })]

    const slugTypes = ["BP_Crystal_C", "BP_Crystal_mk2_C", "BP_Crystal_mk3_C"]

    const [filterElement, setFilterElement] = useState<any>(null)
    useEffect(() => {
        const fetchData = async () => {
            const uwuDataEntries = await Promise.all(Object.entries(data).map(async ([key, value]) => {
                let uwuData = await (await fetch(baseURL + value.url)).json();
                return [key, uwuData];
            }));

            let combinedGoodUwUData: { [key: string]: any[] } = {};
            let uniqueItems = new Set();

            uwuDataEntries.forEach(([key, uwuData]) => {
                if (!uwuData) return;

                uwuData.forEach((item: any) => {
                    if (item["Name"] === "N/A" || (!item["Purity"] && !slugTypes.includes(item["ClassName"]))) return;

                    const bread = slugTypes.includes(item["ClassName"]) ? "slugs" : item["ClassName"];
                    const uniqueKey = `${item["ClassName"]}-${item["Purity"]}`;

                    if (!uniqueItems.has(uniqueKey)) {
                        uniqueItems.add(uniqueKey);

                        if (!combinedGoodUwUData[bread]) {
                            combinedGoodUwUData[bread] = [];
                        }
                        combinedGoodUwUData[bread].push(item);
                    }
                });
            });

            const purityOrder = {"Pure": 0, "Normal": 1, "Impure": 2};
            Object.keys(combinedGoodUwUData).forEach((className) => {
                combinedGoodUwUData[className].sort((a: any, b: any) => {
                    // @ts-ignore
                    const itemA = purityOrder[a["Purity"]] ?? a["ClassName"];
                    // @ts-ignore
                    const itemB = purityOrder[b["Purity"]] ?? a["ClassName"];
                    return itemA - itemB;
                });
            });

            setFilterElement(<div className="gap-1 flex flex-col">
                {Object.entries(combinedGoodUwUData).map(([uwuKey, items]) => (
                    <div key={uwuKey} className="grid grid-cols-3 gap-1">
                        {items.map((item: any, index) => {
                            const className: string = item.ClassName;
                            const name: string = item.Name;
                            const purity: string = item.Purity;
                            const slugTier = {
                                BP_Crystal_C: "mk1", BP_Crystal_mk2_C: "mk2", BP_Crystal_mk3_C: "mk3",
                            }[className];

                            const colors = {
                                pure: "96deg,44%,68%",
                                normal: "20deg,79%,70%",
                                impure: "359deg,68%,71%",
                                mk1: "200,61%,42%",
                                mk2: "26,69%,48%",
                                mk3: "288,61%,50%",
                            };
                            const isChecked = nyaa_resource_filters.includes(`${className}-${purity}`) || nyaa_slug_filters.includes(className);

                            // @ts-ignore
                            const color = colors[slugTypes.includes(className) ? slugTier : purity?.toLowerCase()] ?? "229deg,13%,52%";
                            const icon: string = `markers/normal/${className}.png`;


                            const toggleFilter = () => {
                                if (slugTier) {
                                    setSlugFilters((prevFilters) => prevFilters.includes(className) ? prevFilters.filter((item) => item !== className) : [...prevFilters, className]);
                                } else if (purity) {
                                    setResourceFilters((prevFilters) => prevFilters.includes(`${className}-${purity}`) ? prevFilters.filter((item) => item !== `${className}-${purity}`) : [...prevFilters, `${className}-${purity}`]);
                                }
                            };

                            const element = (<div
                                key={uwuKey + index}
                                className={`border items-center justify-center flex-col p-2 rounded-2xl inline-flex gap-1 relative w-full h-full`}
                                style={{
                                    backgroundColor: `hsla(${color}, 0.5)`, borderColor: `hsl(${color})`,
                                }}
                                onClick={toggleFilter}
                            >
                                <img src={icon} alt={className} className="size-[50px] top-[10px]"/>
                                <Badge
                                    className="left-0 right-0 bottom-[-10px] backdrop-blur-md bg-white/10 text-white border hover:bg-white/5 transition-all duration-700 text-center justify-center"
                                    style={{borderColor: `hsl(${color})`}}
                                >
                                    {slugTier?.toUpperCase() ?? name ?? className}
                                </Badge>
                                <div
                                    className="top-[5px] left-[5px] size-6 absolute rounded-full bg-card text-primary border-[2px] flex items-center justify-center"
                                    style={{borderColor: `hsl(${color})`}}>
                                    {isChecked ? <Check className={"size-5"}/> : <X className={"size-5"}/>}
                                </div>
                            </div>)

                            return (element);
                        })}
                    </div>))}
            </div>);
        };

        fetchData();
    }, [nyaa_resource_filters, nyaa_slug_filters]);

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
                        <Layers className="mr-2 h-4 w-4"/> Layers
                    </div>
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
                <ScrollArea className={"h-[90vh]"} type={"scroll"}>
                    <SheetHeader>
                        <SheetTitle>Layers & Filters</SheetTitle>
                        <SheetDescription>
                            <div className={"gap-2 flex flex-col"}>
                                {Object.entries(nyaa).map(([key, value], index) => {
                                    // @ts-ignore
                                    const uwuLayer = layerStuff[key]
                                    return (<Toggle
                                        key={key}
                                        defaultPressed={value.visible}
                                        onPressedChange={(pressed) => {
                                            value.visible = pressed
                                            setUwU(nyaa)
                                        }}
                                        pressed={value.visible}
                                        style={{gap: 5}}
                                        className={"bg-[hsla(29,75%,65%,0.5)] data-[state=on]:bg-[hsla(29,75%,65%,0.7)] border border-[hsl(29,75%,65%)] text-white w-full"}
                                    >
                                        <Avatar style={{height: 32, width: 32}}>
                                            <AvatarImage src={uwuLayer.icon}/>
                                            <AvatarFallback>{key}</AvatarFallback>
                                        </Avatar>
                                        {uwuLayer.label}
                                    </Toggle>)
                                })}
                            </div>

                            <Separator className={"my-[15px]"}/>

                            <div className={"gap-2 flex-col flex w-full"}>
                                {filterElement}
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </ScrollArea>
            </SheetContent>
        </Sheet>

        <DeckGL
            layers={[mapImg, ...master]}
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
