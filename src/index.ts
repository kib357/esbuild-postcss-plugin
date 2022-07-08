import { Plugin, PluginBuild } from "esbuild";
import path from "path";
import { makeProcessCSS, makeProcessModuleCss } from "./postcss";
import { TransformCache } from "./transformCache";
import { PostCSSPlugin } from "./types";

const virtualModuleExt = "postcss-module";
const virtualModuleFilter = new RegExp(`\.${virtualModuleExt}$`);

const postCSSPlugin: PostCSSPlugin = ({
  baseUrl = "",
  filter = /\.css$/,
  modulesOptions = {},
  modulesFilter = /\.module.css$/,
  plugins = [],
} = {}): Plugin => {
  return {
    name: "postcss-loader",
    setup(build: PluginBuild) {
      const cssMap = new Map();
      const cache = new TransformCache();
      const processCSS = makeProcessCSS(plugins);
      const processModuleCss = makeProcessModuleCss(plugins, modulesOptions);

      build.onResolve({ filter }, async (args) => {
        if (args.namespace === "postcss-resolve") return;

        const useBaseUrl = Boolean(baseUrl && args.path.indexOf(".") !== 0);
        const resolveDir = useBaseUrl ? baseUrl : args.resolveDir;
        const resolvePath = useBaseUrl ? `./${args.path}` : args.path;

        const result = await build.resolve(resolvePath, {
          resolveDir,
          namespace: "postcss-resolve",
        });
        if (result.errors.length > 0) {
          return { errors: result.errors };
        }

        const isModuleFilterPassed = modulesFilter.test(args.path);
        const isInternalCssImport = args.kind === "import-rule";

        return {
          path: result.path,
          namespace: "postcss",
          pluginData: {
            isModule: isModuleFilterPassed && !isInternalCssImport,
          },
        };
      });

      build.onLoad(
        { filter, namespace: "postcss" },
        async ({ path: filePath, pluginData }) => {
          const processor = pluginData.isModule ? processModuleCss : processCSS;
          const [css, classes] = await cache.getOrTransform(filePath, (input) =>
            processor(input, filePath)
          );

          const resolveDir = path.dirname(filePath);

          if (!pluginData.isModule)
            return { contents: css, loader: "css", resolveDir };

          const modulePath = `${filePath}.${virtualModuleExt}`;
          cssMap.set(modulePath, css);
          return {
            contents: makeCssModuleJs(modulePath, classes),
            loader: "js",
            resolveDir,
            watchFiles: [filePath],
          };
        }
      );

      build.onResolve({ filter: virtualModuleFilter }, (args) => {
        return {
          path: args.path,
          namespace: virtualModuleExt,
          pluginData: { resolveDir: args.resolveDir },
        };
      });

      build.onLoad(
        { filter: virtualModuleFilter, namespace: virtualModuleExt },
        (args) => {
          return {
            contents: cssMap.get(args.path),
            loader: "css",
            resolveDir: args.pluginData.resolveDir,
          };
        }
      );
    },
  };
};

export default postCSSPlugin;

const makeCssModuleJs = (
  modulePath: string,
  cssModulesJSON: unknown
) => `import '${modulePath}';
export default ${JSON.stringify(cssModulesJSON)};`;
