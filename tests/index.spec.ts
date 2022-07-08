import esbuild, { Plugin } from "esbuild";
import expect from "expect";
import path from "path";
import postCSSPlugin from "../src";

it("builds basic js with css", async () => {
  const { outputFiles } = await build("./src/basic.ts", postCSSPlugin());
  expect(outputFiles).toHaveLength(2);
  expect(outputFiles[0].path).toMatch(/basic.js$/);
  expect(outputFiles[1].path).toMatch(/basic.css$/);
});

it("respects baseUrl for absolute paths", async () => {
  const { outputFiles } = await build(
    "./src/absolute.ts",
    postCSSPlugin({ baseUrl: path.resolve(__dirname, "./src") })
  );
  expect(outputFiles).toHaveLength(2);
  expect(outputFiles[0].path).toMatch(/absolute.js$/);
  expect(outputFiles[1].path).toMatch(/absolute.css$/);
});

it("loads css as global when path does not match modulesFilter", async () => {
  const { outputFiles } = await build("./src/basic.ts", postCSSPlugin());

  expect(outputFiles[1].text).toMatch(/.style {/);
});

it("loads .module.css files as css-module by default", async () => {
  const { outputFiles } = await build(
    "./src/module.ts",
    postCSSPlugin({
      modulesOptions: {
        generateScopedName: (name: string) => name + "_test",
      },
    })
  );

  expect(outputFiles[1].text).toMatch(/.style_test {/);
});

it("respects modulesOptions with globalModulePaths", async () => {
  const { outputFiles } = await build(
    "./src/module.ts",
    postCSSPlugin({
      modulesOptions: {
        globalModulePaths: [/style.module.css$/],
      },
    })
  );

  expect(outputFiles[1].text).toMatch(/.style {/);
});

it("loads css @import", async () => {
  const { outputFiles } = await build("./src/import.ts", postCSSPlugin());
  expect(outputFiles).toHaveLength(2);
  expect(outputFiles[0].path).toMatch(/import.js$/);
  expect(outputFiles[1].path).toMatch(/import.css$/);
});

it("css @import bypass modules", async () => {
  const { outputFiles } = await build(
    "./src/import.ts",
    postCSSPlugin({ modulesFilter: /\.css$/ })
  );

  expect(outputFiles[1].text).toMatch(/.style {/);
});

const build = (entryPoint: string, plugin: Plugin) => {
  return esbuild
    .build({
      entryPoints: [path.join(__dirname, entryPoint)],
      bundle: true,
      outdir: "dist",
      write: false,
      plugins: [plugin],
    })
    .catch((e) => {
      process.exit(1);
    });
};
