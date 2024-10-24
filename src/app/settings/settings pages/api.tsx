"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

async function checkConnection(URL: string) {
  const urlCleaned = () => {
    let url = URL.trim();
    if (url == "/") return URL;
    url = url.endsWith("/") ? url : `${url}/`;
    return /^https?:\/\//i.test(url) ? url : `http://${url}`;
  };

  return await fetch(urlCleaned() + "getCoffee")
    .then(async (response) => {
      if (response.status === 200) {
        localStorage.setItem("url", urlCleaned());

        return true;
      }
    })
    .catch((err) => {
      return false;
    });
}

export default function Settings_API() {
  const [url, setUrl] = useState("");
  const [connected, setConnected] = useState(false);
  const [fSpeed, setFSpeed] = useState(1000);
  const [mFSpeed, setMFSpeed] = useState(2500);

  useEffect(() => {
    setUrl(localStorage.getItem("url") ?? location.origin);
    setFSpeed(parseInt(localStorage.getItem("fSpeed") ?? "1000") ?? 1000);
    setMFSpeed(parseInt(localStorage.getItem("mFSpeed") ?? "2500") ?? 2500);
  }, []);

  useEffect(() => {
    (async () => setConnected((await checkConnection(url)) || false))();
  }, [url]);
  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ textAlign: "center" }}>API</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ margin: 5 }}>
          <div style={{ margin: 5 }}>
            <Label htmlFor="urlInput">API Url (http://example:8080 or /)</Label>
            <Input
              type="text"
              id="urlInput"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="API Url (http://example:8080)"
              style={{
                backgroundColor: connected
                  ? "hsla(96, 44%, 68%, .2)"
                  : "hsla(359, 68%, 71%, .2)",
                borderColor: connected
                  ? "hsla(96, 44%, 68%, 1)"
                  : "hsla(359, 68%, 71%, 1)",
              }}
            />
          </div>
          <div style={{ margin: 5 }}>
            <Label style={{ margin: 5 }} htmlFor="fSpeedInput">
              Data Fetch Speed (ms)
            </Label>
            <Input
              type="number"
              id="fSpeedInput"
              value={fSpeed}
              onChange={(event) => {
                setFSpeed(parseInt(event.target.value));
                localStorage.setItem("fSpeed", event.target.value);
              }}
              placeholder="Data Fetch Speed (ms)"
            />
          </div>
          <div style={{ margin: 5 }}>
            <Label style={{ margin: 5 }} htmlFor="mFSpeedInput">
              Map Data Fetch Speed (ms)
            </Label>
            <Input
              type="number"
              id="mFSpeedInput"
              value={mFSpeed}
              onChange={(event) => {
                setMFSpeed(parseInt(event.target.value));
                localStorage.setItem("mFSpeed", event.target.value);
              }}
              placeholder="Map Data Fetch Speed (ms)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
