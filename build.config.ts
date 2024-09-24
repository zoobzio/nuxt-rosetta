import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/module"],
  clean: true,
  declaration: true,
  externals: ["@nuxt/schema"],
  outDir: ".dist",
});
