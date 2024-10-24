"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const cards = [
  {
    title: "Documentation",
    link: "https://docs.ficsit.app/ficsitremotemonitoring/latest/index.html",
    description: "FRM Documentation",
  },
  {
    title: "GitHub",
    link: "https://github.com/porisius/FicsitRemoteMonitoring",
    description: "FRM's source code on GitHub",
  },
  {
    title: "Discord",
    link: "https://discord.gg/tv3jbJW3RX",
    description: "The official discord server",
  },
];

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 5,
        boxSizing: "border-box",
        alignItems: "stretch",
        margin: 5,
        marginTop: 25,
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className="card"
          style={{
            flex: "1 1 500px",
            height: "100%",
          }}
        >
          <Link
            style={{
              position: "relative",
              flexGrow: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            href={card.link}
          >
            <Card>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
