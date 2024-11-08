"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import ShineBorder from "@/components/ui/shine-border";

const cards = [{
    title: "Documentation",
    link: "https://docs.ficsit.app/ficsitremotemonitoring/latest/index.html",
    description: "FRM Documentation",
}, {
    title: "GitHub",
    link: "https://github.com/porisius/FicsitRemoteMonitoring",
    description: "FRM's source code on GitHub",
}, {
    title: "Discord", link: "https://discord.gg/tv3jbJW3RX", description: "The official discord server",
},];

export default function Home() {
    return (<div>
        <div
            className={"grid grid-cols-3 gap-[5px] m-[5px] mt-[25px] justify-center"}
        >
            {cards.map((card, i) => (<ShineBorder
                color={["#e8a361", "#ca6d35"]}
                key={i}
                className={"relative rounded  p-0 min-w-0 w-full h-full min-h-0 flex"}
            >
                <Link href={card.link} className={"text-center w-full h-full p-0"}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{card.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            </ShineBorder>))}
        </div>
    </div>);
}
