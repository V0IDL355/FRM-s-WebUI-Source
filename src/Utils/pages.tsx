import Map from "../Pages/Map";
import Power from "../Pages/Power";
import Drone from "../Pages/Drone";
import OverallProd from "../Pages/OverallProd";
import DetailedProd from "../Pages/DetailedProd";
import Settings from "../Pages/Settings";
import ResourceSink from "../Pages/ResourceSink";
import Home from "../Pages/Home";

import * as Icons from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

const pages: Page[] = [
  {
    node: <Home />,
    icon: <Icons.Home />,
    link: "/FRM-s-WebUI-Source/Home",
    label: "Home",
  },
  {
    node: <ResourceSink />,
    icon: <Icons.Print />,
    link: "/FRM-s-WebUI-Source/ResourceSink",
    label: "Resource Sink",
  },
  {
    node: <Map />,
    icon: <Icons.Map />,
    link: "/FRM-s-WebUI-Source/Map",
    label: "Map",
  },
  {
    node: <Power />,
    icon: <Icons.Power />,
    link: "/FRM-s-WebUI-Source/Power",
    label: "Power",
  },
  {
    node: <Drone />,
    icon: <Icons.Flight />,
    link: "/FRM-s-WebUI-Source/Drone",
    label: "Drone",
  },
  {
    node: <OverallProd />,
    icon: <Icons.Factory />,
    link: "/FRM-s-WebUI-Source/OverallProd",
    label: "Overall Prod",
  },
  {
    node: <DetailedProd />,
    icon: <Icons.Factory />,
    link: "/FRM-s-WebUI-Source/DetailedProd",
    label: "Detailed Prod",
  },
  {
    node: <Settings />,
    icon: <Icons.Settings />,
    link: "/FRM-s-WebUI-Source/Settings",
    label: "Settings",
  },
  // Add other pages as needed
];

interface Page {
  node: JSX.Element;
  icon: JSX.Element;
  link: string;
  label: string;
}

export default pages;
