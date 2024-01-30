import { signal } from "@preact/signals-react";

const defaultP = "#e8a361";
const defaultS = "#ca6d35";
export const primaryColor = signal(
  localStorage.getItem("primaryC") || defaultP,
);
export const secondaryColor = signal(
  localStorage.getItem("secondaryC") || defaultS,
);

export function resetDefault() {
  localStorage.setItem("primaryC", defaultP);
  localStorage.setItem("secondaryC", defaultS);

  primaryColor.value = defaultP;
  secondaryColor.value = defaultS;

  window.location.reload();
}
