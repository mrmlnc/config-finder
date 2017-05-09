# API

#### Constructor(workspace: string, options: IOptions)

Create instance of `ConfigProfiler` class.

```js
const ConfigProfiler = require('config-profiler');
const configProfiler = new ConfigProfiler('./path', {});
```

> For more details about the options, see [`ICoreOptions`](options.md#icoreoptions) and [`IChangeableOptions`](options.md#ichangeableoptions).

#### setWorkspace(workspace)

Set a new workspace directory path.

```js
configProfiler.setWorkspace('./path/to/workspace');
```

#### setOptions(options: IOptions)

Set a new options.

```js
configProfiler.setOptions({
  configFiles: ['config.json', 'config.js']
});
```

> For more details about the options, see [`ICoreOptions`](options.md#icoreoptions) and [`IChangeableOptions`](options.md#ichangeableoptions).

#### getConfig(filepath, [options: IChangeableOptions]) => Promise

Get config for the current file path.

```js
configProfiler.getConfig('./path/to/workspace/index.txt').then((result) => {
  // console.log(result);
  // { from: './path/to/workspace/config.json', config: { ok: true } }
});
```

> **Warning**
>
> Here available not all options. See only [`IChangeableOptions`](options.md#ichangeableoptions) options.
