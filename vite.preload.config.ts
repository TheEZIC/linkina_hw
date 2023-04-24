import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [paths()],
});
