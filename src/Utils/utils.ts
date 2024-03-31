import {LayerGroup} from "leaflet";
import {Layer} from "./map";
import {signal} from "@preact/signals-react";

export const online = signal(false);

export async function connected(URL: string) {
    const urlCleaned = () => {
        const url = URL.endsWith("/") ? `${URL}` : `${URL}/`
        return url.includes("http://") || url.includes("https://") ? url : `http://${url}`
    }
    return await fetch(urlCleaned() + "getAll")
        .then((response) => {
            if (response.status === 200) {
                localStorage.setItem("url", urlCleaned());
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
