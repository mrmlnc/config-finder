# Options

  * [`ICoreOptions`](options.md#icoreoptions)
  * [`IChangeableOptions`](options.md#ichangeableoptions)

## ICoreOptions

#### `predefinedConfigs`

  * Type: `Object`
  * Default: `{}`

Predefined configs. Must have the name of the config, which can be called from `options.settings` (as string) or `options.props.extends` from the `options.settings` (as object) or found config file.

For example, usage with `options.settings`:

```json
{
  "predefinedConfigs": { "name": { "ok": true } },
  "settings": "name"
}
```

For example, usage with `options.props.extends` (`extends` by default) from found config file:

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

#### `envVariableName`

  * Type: `String`
  * Default: `null`

Allow to get the path to the configuration file from environment variable.

#### `props`

  * Type: `Object`
  * Default: `{ package: null, extends: 'extends' }`
  * Available: `IOptions`

##### `proprs.package`

  * Type: `String`
  * Default: `extends`

The name of property in the `package.json` file. If you set this option, we'll look for `package.json` file.

##### `props.extends`

  * Type: `String`
  * Default: `extends`

Allow to use `extends` property in a configuration file or settings to reference to another configuration file or predefined config.

Use `~` to refer to HOME directory and `./` or `../` to refer to the current workspace (relative). Also you can use absolute path.

> **Tip**
>
> We'll merge config in order from the most deep to the top.

See [`fixtures/extends`](../fixtures/extends) directory as an example.

#### `cache`

  * Type: `Boolean`
  * Default: `true`

Control of cache.

## IChangeableOptions

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

#### `allowHomeDirectory`

  * Type: `Boolean`
  * Default: `true`

Allow configs in the HOME directory or not.

#### `extendBuildedConfig`

  * Type: `Boolean`
  * Default: `null`

Merge builded config with passed object.
