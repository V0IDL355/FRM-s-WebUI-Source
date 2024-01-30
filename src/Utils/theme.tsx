import createTheme from "@mui/material/styles/createTheme";
import { primaryColor, secondaryColor } from "./setting vars";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor.value,
    },
    secondary: {
      main: secondaryColor.value,
    },
  },
});
