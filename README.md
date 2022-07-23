# ESBuild plugin for PostCSS with CSS modules

This plugin for postcss built with intention to create fast, high-performance, reliable and tested solution to ESBuild with postcss and post-css modules

## Installation

```
npm i esbuild-postcss-plugin
```

## Usage

Add plugin to ESBuild build config

```typescript
const postCSSPlugin = require("esbuild-postcss-plugin");

plugins: [postCSSPlugin()];
```

## Options

### filter

A regular expression to filter source files processed by plugin

**Default**: `/\.css$/`

```typescript
postCSSPlugin({ filter: /\.css$/ });
```

### disableCache

Cache gives more speed on rebuild. Unfortunately, in cases when postcss transform result depends on other files, cache will cause incorrect behavior. For example, tailwindcss scans template files to build final CSS, and changes in templates require CSS cache invalidation.

**Default**: `false`

```typescript
postCSSPlugin({ disableCache: true });
```

### modulesFilter

A regular expression to filter source files processed with postcss-modules

**Default**: `/\.module.css$/`

```
postCSSPlugin({ modulesFilter: /\.module.css$/ })
```

### modulesOptions

See postcss-modules package options: https://github.com/madyankin/postcss-modules

**Warning!** `Loader`, `resolve` and `root` options will be ignored.

**Default**: `empty`

```
postCSSPlugin({
  modulesFilter: /\.css$/,
  modulesOptions: {
    globalModulePaths: [/index.css$/],
  }
})
```

### plugins

List of AcceptedPlugin for postcss.

**Default**: `[]`

```
postCSSPlugin({
  plugins: [require("autoprefixer")]
})
```
