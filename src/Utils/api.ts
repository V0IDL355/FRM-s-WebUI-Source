import { signal } from "@preact/signals-react";
import axios from "axios";

export const api = axios.create({
  baseURL: `http://${localStorage.getItem("ip")?.toString()}/`,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export const fdelay = signal(
  parseInt(localStorage.getItem("fspeed") ?? "1000")
);
export const mdelay = signal(
  parseInt(localStorage.getItem("mfspeed") ?? "2500")
);
