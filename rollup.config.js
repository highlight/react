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
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true,
        globals: {
          react: "React",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    ],
    treeshake: "smallest",
    external: ["react", "react/jsx-runtime"], // peer dependencies
    plugins: [
      postcss({
        minimize: true,
        sourceMap: true,
      }),
      resolve(),
      esbuild(),
      terser({ mangle: true }),
      filesize(),
    ],
  },
];

export default rollupBuilds;
