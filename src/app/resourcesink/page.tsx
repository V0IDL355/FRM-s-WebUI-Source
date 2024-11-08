"use client";

import {useSignalEffect} from "@preact/signals-react";
import {api, fdelay} from "@/lib/api";
import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {CartesianGrid, Line, LineChart, XAxis} from "recharts";
import {Badge} from "@/components/ui/badge";

const chartConfig = {
    points: {
        label: "Points", color: "#e79c53"
    }, resourceSink: {
        label: "Resource Sink", color: "#e79c53",
    }, explorationSink: {
        label: "Exploration Sink", color: "#a779a7",
    },
} satisfies ChartConfig;

export default function ResourceSink() {
    const [data, setData] = useState<any>({resource: [], exploration: []});
    const [chartData, setChartData] = useState<any>([]);

    useSignalEffect(() => {
        const interval = setInterval(async () => {
            try {
                const resourceSink = (await api.get("/getResourceSink")).data[0];
                const explorationSink = (await api.get("/getExplorationSink")).data[0];

                let tempArray: any = [{
                    name: "Resource Sink", t: "resourceSink", graphPoints: []
                }, {name: "Exploration Sink", t: "explorationSink", graphPoints: []}]

                for (let i = 0; i < resourceSink["GraphPoints"].length; i++) {
                    tempArray[0].graphPoints.push({
                        resourcePoints: resourceSink["GraphPoints"][i], index: i
                    });
                }
                for (let i = 0; i < explorationSink["GraphPoints"].length; i++) {
                    tempArray[1].graphPoints.push({
                        explorationPoints: explorationSink["GraphPoints"][i], index: i, t: ""
                    });
                }

                setChartData(tempArray);
                setData({resource: resourceSink, exploration: explorationSink});
            } catch {
            }
        }, fdelay);
        return () => {
            clearInterval(interval);
        };
    });

    return (<div style={{justifyItems: "center", display: "grid"}}>
        <Card
            style={{
                width: "25%", margin: "10px", minWidth: "200px", textAlign: "center",
            }}
        >
            <CardHeader>
                <CardTitle>You have: {data.resource.NumCoupon ?? 0} coupons</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <div className={"flex justify-center items-center"}>
                        <div
                            className={"w-full h-6 rounded-t relative bg-secondary overflow-hidden"}>
                            <div className={"bg-[#e79c53] h-full transition-all"}
                                 style={{
                                     width: `${data.resource.Percent * 100}%`
                                 }}
                            />
                        </div>
                        <Badge className={"text-[#e79c53] absolute bg-secondary"} variant={"outline"}>
                            {Math.round(data.resource.Percent * 100)}%
                        </Badge>
                    </div>
                    <div className={"flex justify-center items-center relative"}>
                        <div
                            className={"w-full h-6 rounded-b relative bg-secondary overflow-hidden"}>
                            <div className={"bg-[#a779a7] h-full transition-all"}
                                 style={{
                                     width: `${data.exploration.Percent * 100}%`
                                 }}
                            />
                        </div>
                        <Badge className={"text-[#a779a7] absolute bg-secondary"} variant={"outline"}>
                            {Math.round(data.exploration.Percent * 100)}%
                        </Badge>
                    </div>
                </div>

            </CardContent>
            <ChartContainer config={chartConfig}>
                <LineChart
                    accessibilityLayer
                    margin={{
                        left: 12, right: 12,
                    }}

                >
                    <CartesianGrid vertical={false}/>
                    <XAxis dataKey="index" type={"category"} tickLine={false} axisLine={false}
                           allowDuplicatedCategory={false}/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey="name" nameKey="name"/>}/>
                    <ChartLegend/>

                    <Line
                        dataKey="resourcePoints"
                        type="monotone"
                        stroke="var(--color-resourceSink)"
                        strokeWidth={2}
                        dot={false}
                        data={chartData[0]?.graphPoints}
                        name={"Resource Sink"}
                    />
                    <Line
                        dataKey="explorationPoints"
                        type="monotone"
                        stroke="var(--color-explorationSink)"
                        strokeWidth={2}
                        dot={false}
                        data={chartData[1]?.graphPoints}
                        name={"Exploration Sink"}
                    />
                </LineChart>
            </ChartContainer>
        </Card>
    </div>);
}
