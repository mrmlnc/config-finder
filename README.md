# config-profiler

> Find configuration for the current file from provided path, settings, `package.json`, workspace, HOME directory or env variable.

## Donate

If you want to thank me, or promote your Issue.

[![Gratipay User](https://img.shields.io/gratipay/user/mrmlnc.svg?style=flat-square)](https://gratipay.com/~mrmlnc)

> Sorry, but I have work and support for plugins and modules requires some time after work. I will be glad of your support or PR's.

## Install

```shell
$ npm i -S config-profiler
```

## Why?

  * Originally designed for my VS Code plugins, because many plugins use similar code.
  * The ability to add your parsers for specific files or for one file.
  * The ability to setup predefined configs and use they from configs.
  * Less dependencies and more features.

## How it works?

For example, if your config name is "my-cofig" we will search out configuration in the following places and order:

  1. Settings (if you set `options.settings`):
    * Return `options.settings` if they are the object.
    * Return config from `oprions.predefinedConfigs` by name in the `options.settings` if is a string and it is found.
    * Return config from filepath defined in the `options.settings`.
  2. Trying to get the path to the config file from environment variable (if you set `options.envVariableName`)
  3. Trying to find the config file in the current workspace (cwd). Closest config file to the current file. File from the following list:
    * `options.configFiles`
    * `package.json` if you set `options.packageProp`
  4. Trying to find the config file in the HOME directory.
  5. If no configuration object is found then we return `null`.

## Usage

```js
const ConfigProfiler = require('config-profiler');

const configProfiler = new ConfigProfiler('./path/to/current/workspace', {
  configFiles: ['my-super-module-config.json', 'my-super-module-config.js']
});

configProfiler.getConfig('./path/to/current/file').then((result) => {
  console.log(result);
  // { from: './bla/bla/my-super-module-config.json', config: { ok: true } }
});
```

## API

```js
const ConfigProfiler = require('config-profiler');
const configProfiler = new ConfigProfiler('./path', {});
```

#### setWorkspace(workspace)

Set a new workspace directory path.

```js
configProfiler.setWorkspace('./path/to/workspace');
```

#### setOptions(options)

Set a new options.

```js
configProfiler.setOptions({
  configFiles: ['config.json', 'config.js']
});
```

#### getConfig(filepath, [options]) => Promise

Get config for the current file path.

```js
configProfiler.getConfig('./path/to/workspace/index.txt').then((result) => {
  // console.log(result);
  // { from: './path/to/workspace/config.json', config: { ok: true } }
});
```

## Options

#### `settings`

  * Type: `Object|String`
  * Default: `null`

The settings from the editor or plugin/module options. Can have the object, the name of a predefined config or the path to the config.

```json
{
  "predefinedConfigs": { "name": { "ok": true } },
  "settings": { "ok": true },
  "settings": "name",
  "settings": "~/my-module-config.json",
  "settings": "../configs/my-module-config.json"
}
```

> **Tip**
>
> Use `~` to refer to HOME directory and `./` or `../` to refer to the current workspace (relative). Also you can use absolute path.

#### `predefinedConfigs`

  * Type: `Object`
  * Default: `{}`

Predefined configs. Must have the name of the config, which can be called from `options.settings` (as string) or `options.extendsProp` from the `options.settings` (as object) or found config file.

For example, usage with `options.settings`:

```json
{
  "predefinedConfigs": { "name": { "ok": true } },
  "settings": "name"
}
```

For example, usage with `options.extendsProp` (`extends` by default) from found config file:

```json
{
  "extends": "name"
}
```

Predefined config will be merged with config from found config file.

#### `configFiles`

  * Type: `String[]`
  * Default: `[]`

The names of the config files that can be used as a configs.

#### `parsers`

  * Type: `Parser[]`
  * Default: `see below`

Parsers that will be apply to the found configs. The parser receive the content from the configuration file and returns an object.

```js
{
  options: {
    parsers: [
      // Before applying the parser we check the pattern for the current file
      { pattern: /.*\.yml$/, parser: (text) => mySuperYamlParser(text) }
    ]
  }
}
```

The `Parser` interface has the following type:

```ts
interface Parser {
  pattern: RegExp;
  parser: (text: string) => object;
}
```

#### `useEachParser`

  * Type: `Boolean`
  * Default: `false`

Allow to use each parser to config file. Necessary in the case that a single file can have multiple syntaxes. We just ignore the `pattern` property.

#### `transform`

  * Type: `Function`
  * Default: `(result) => result`

A function that returns the result. The `result` has the following object:

```js
{
  from: './path/to/config/file.json', // Also can be 'settings' or 'predefined'
  config: { ok: true }
}
```

#### `packageProp`

  * Type: `String`
  * Default: `null`

The name of property in the `package.json` file. If you set this option, we'll look for `package.json` file.

#### `extendsProp`

  * Type: `String`
  * Default: `extends`

Allow to use `extends` property in a configuration file or settings to reference to another configuration file or predefined config.

Use `~` to refer to HOME directory and `./` or `../` to refer to the current workspace (relative). Also you can use absolute path.

> **Tip**
>
> We'll merge config in order from the most deep to the top.

See [`fixtures/extends`](fixtures/extends) directory as an example.

#### `envVariableName`

  * Type: `String`
  * Default: `null`

Allow to get the path to the configuration file from environment variable.

#### `allowHomeDirectory`

  * Type: `Boolean`
  * Default: `true`

Allow configs in the HOME directory or not.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/config-profiler/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
