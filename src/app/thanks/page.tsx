"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Thanks() {
  const thxTo = [
    {
      name: "Feyko",
      reason: "Support and guidance to a noob Unreal Engine modder",
      link: "https://discordapp.com/users/227473074616795137",
    },
    {
      name: "Robb",
      reason: "Answering my dumb questions",
      link: "https://discordapp.com/users/187385442549628928",
    },
    {
      name: "Vilsol",
      reason:
        "Also answering my dumb questions and helping with the documentation system",
      link: "https://discordapp.com/users/135134753534771201",
    },
    {
      name: "Nog",
      reason: "Answering the dumbest of my questions",
      link: "https://discordapp.com/users/277050857852370944",
    },
    {
      name: "Archengius",
      reason: "Helping with the UE Garbage Collection Issue",
      link: "https://discordapp.com/users/163955176313585666",
    },
    {
      name: "Deantendo",
      reason: "Icon/Graphic for FRM",
      link: "https://discordapp.com/users/293484684787056640",
    },
    {
      name: "Andre Aquila",
      reason:
        "Production Stats code for FRM (Seriously, that would have taken me forever to develop",
      link: "https://discordapp.com/users/294943551605702667",
    },
    {
      name: "Badger",
      reason: "For the FRM Companion App",
      link: "https://discordapp.com/users/186896287856197633",
    },
    {
      name: "BLAndrew575",
      reason:
        "For giving me a crazy world to brutally stress test the getFactory caching function",
      link: "https://discordapp.com/users/509759568037937152",
    },
    {
      name: "VOID",
      reason: "Contributions to FRM's native web UI",
      link: "https://discordapp.com/users/212243828831289344",
    },
    {
      name: "FeatheredToast",
      reason: "Finding and helping resolve the dumb things I did dumb",
      link: "https://discordapp.com/users/130401633564753920",
    },
    {
      name: "Satisfactory Modding Discord",
      reason:
        "For motivating me and letting me vent as I go through my day and also develop this mod",
      link: "https://discord.gg/amuR4xyqP8",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: 25,
        gap: 5,
        boxSizing: "border-box",
      }}
    >
      {thxTo.map((thanks, i) => (
        <div
          key={i}
          className="card"
          style={{
            flex: "1 1 500px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Link
            href={thanks.link}
            style={{
              zIndex: 2,
              position: "relative",
              flexGrow: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <CardHeader>
                <CardTitle>{thanks.name}</CardTitle>
              </CardHeader>
              <CardContent style={{ flexGrow: 1 }}>
                <p>{thanks.reason}</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
