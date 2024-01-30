import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import packageJson from "./package.json";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/#/",
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
  build: {
    outDir: "dist",
    assetsDir: "",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  ssr: {
    noExternal: ["react", "react-dom"],
  },
});
