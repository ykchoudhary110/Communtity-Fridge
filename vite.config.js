// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

const candidateFiles = [
  path.resolve(__dirname, "node_modules/tslib/tslib.es6.js"),
  path.resolve(__dirname, "node_modules/tslib/tslib.esm.js"),
  path.resolve(__dirname, "node_modules/tslib/tslib.umd.js"),
  path.resolve(__dirname, "node_modules/tslib/tslib.js"),
  path.resolve(__dirname, "node_modules/tslib/index.js")
];

const found = candidateFiles.find((p) => fs.existsSync(p));
const alias = found ? { tslib: found } : {};

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["tslib"]
  },
  resolve: {
    alias
  }
});
