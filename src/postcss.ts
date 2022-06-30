import postcss, { AcceptedPlugin } from "postcss";
import cssModules from "postcss-modules";

interface Processor {
  (input: string, filePath: string): Promise<
    [css: string, classes?: Record<string, string>]
  >;
}

export const makeProcessCSS =
  (plugins: AcceptedPlugin[]): Processor =>
  async (input: string, filePath: string) => {
    const result = await postcss(plugins).process(input, {
      from: filePath,
      map: false,
    });

    return [result.css];
  };

export const makeProcessModuleCss = (
  plugins: AcceptedPlugin[],
  modulesConfig = {}
): Processor => {
  let classes = {};
  const pluginsWithModules = [
    ...plugins,
    cssModules({
      ...modulesConfig,
      getJSON(cssSourceFile, json) {
        Object.assign(classes, json);
      },
    }),
  ];
  const processor = postcss(pluginsWithModules);

  return async (input: string, filePath: string) => {
    classes = {};
    const result = await processor.process(input, {
      from: filePath,
      map: false,
    });
    return [result.css, classes];
  };
};
