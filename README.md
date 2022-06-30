# ESBuild plugin for PostCSS with CSS modules

This plugin for postcss built with intention to create fast, high-performance, reliable and tested solution to ESBuild with postcss and post-css modules

## Installation

```
npm i esbuild-postcss-plugin
```

## Usage

Add plugin to ESBuild build config

```
const postCSSPlugin = require("esbuild-postcss-plugin");

plugins: [
  postCSSPlugin()
]
```

## Options

### baseUrl

Base directory to resolve non-relative module names imported through CSS @import rule.

**Default**: `""`

```
postCSSPlugin({ baseUrl: path.resolve(__dirname, './src') })
```

### filter

A regular expression to filter source files processed by plugin

**Default**: `/\.css$/`

```
postCSSPlugin({ filter: /\.css$/ })
```

### modulesFilter

A regular expression to filter source files processed with postcss-modules

**Default**: `/\.module.css$/`

```
postCSSPlugin({ filter: /\.module.css$/ })
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
