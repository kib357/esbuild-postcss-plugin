import { Plugin } from "esbuild";
import { AcceptedPlugin } from "postcss";

type PostCSSPluginOptions = {
  baseUrl?: string;
  filter?: RegExp;
  modulesFilter?: RegExp;
  modulesOptions?: ModulesOptions;
  plugins?: AcceptedPlugin[];
  disableCache?: true;
};

export type PostCSSPlugin = (options?: PostCSSPluginOptions) => Plugin;

type GenerateScopedNameFunction = (
  name: string,
  filename: string,
  css: string
) => string;

type LocalsConventionFunction = (
  originalClassName: string,
  generatedClassName: string,
  inputFile: string
) => string;

export interface ModulesOptions {
  getJSON?(
    cssFilename: string,
    json: { [name: string]: string },
    outputFilename?: string
  ): void;

  localsConvention?:
    | "camelCase"
    | "camelCaseOnly"
    | "dashes"
    | "dashesOnly"
    | LocalsConventionFunction;

  scopeBehaviour?: "global" | "local";
  globalModulePaths?: RegExp[];

  generateScopedName?: string | GenerateScopedNameFunction;

  hashPrefix?: string;
  exportGlobals?: boolean;
}
