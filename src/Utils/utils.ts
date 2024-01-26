import { LayerGroup } from "leaflet";
import { Layer } from "./map";
import { signal } from "@preact/signals-react";

const online = signal(false);

export async function connected(ip) {
  return await fetch(`http://${ip}/getAll`)
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("ip", ip);
        online.value = true;
        return true;
      }
    })
    .catch(() => {
      online.value = false;
    });
}

export function pageOptions(pageSize = 100) {
  const options: number[] = [];
  for (let i = 10; i <= pageSize; i += 10) {
    options.push(i);
  }
  return options;
}

export function createLayer({
  name,
  label,
  enabled,
  url,
}: {
  name: string;
  label: string;
  enabled: boolean;
  url: string;
}): Layer {
  return {
    group: new LayerGroup(),
    name: name,
    label: label,
    enabled: enabled,
    url: url,
  };
}
