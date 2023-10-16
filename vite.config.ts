import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import packageJson from "./package.json";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/FRM-s-WebUI-Source/",
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
});
