import Map from "../Pages/Map";
import Power from "../Pages/Power";
import Drone from "../Pages/Drone";
import OverallProd from "../Pages/OverallProd";
import DetailedProd from "../Pages/DetailedProd";
import Settings from "../Pages/Settings";
import ResourceSink from "../Pages/ResourceSink";
import Home from "../Pages/Home";

import * as Icons from "@mui/icons-material";

const pages: Page[] = [
  {
    node: <Home />,
    icon: <Icons.Home />,
    link: "home",
    label: "Home",
  },
  {
    node: <ResourceSink />,
    icon: <Icons.Print />,
    link: "resourcesink",
    label: "Resource Sink",
  },
  {
    node: <Map />,
    icon: <Icons.Map />,
    link: "map",
    label: "Map",
  },
  {
    node: <Power />,
    icon: <Icons.Power />,
    link: "power",
    label: "Power",
  },
  {
    node: <Drone />,
    icon: <Icons.Flight />,
    link: "drone",
    label: "Drone",
  },
  {
    node: <OverallProd />,
    icon: <Icons.Factory />,
    link: "overallprod",
    label: "Overall Prod",
  },
  {
    node: <DetailedProd />,
    icon: <Icons.Factory />,
    link: "detailedprod",
    label: "Detailed Prod",
  },
  {
    node: <Settings />,
    icon: <Icons.Settings />,
    link: "settings",
    label: "Settings",
  },
];

interface Page {
  node: JSX.Element;
  icon: JSX.Element;
  link: string;
  label: string;
}

export default pages;
