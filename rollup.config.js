// rollup.config.js

import esbuild from "rollup-plugin-esbuild";
import filesize from "rollup-plugin-filesize";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const rollupBuilds = [
  {
    input: "./src/index.tsx",
    output: [
      {
        file: pkg.main,
        format: "umd",
        name: "highlight-react",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
    treeshake: "smallest",
    plugins: [
      postcss(),
      resolve(),
      esbuild(),
      terser({ mangle: true }),
      filesize(),
    ],
  },
];

export default rollupBuilds;
