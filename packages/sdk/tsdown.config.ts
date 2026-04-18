import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/client-entry.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: true,
  hash: false,
});
