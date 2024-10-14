"use client";

import axios from "axios";

export const baseURL =
  typeof window !== "undefined" && localStorage.getItem("url")
    ? localStorage.getItem("url")
    : typeof window !== "undefined"
      ? location.origin
      : "http://localhost:8080";

export let fdelay =
  typeof window !== "undefined"
    ? parseInt(localStorage.getItem("fspeed") ?? "1000")
    : 1000;

export let mdelay =
  typeof window !== "undefined"
    ? parseInt(localStorage.getItem("mfspeed") ?? "2500")
    : 2500;

export const api = axios.create({
  baseURL: baseURL || "http://localhost:8080",
});
