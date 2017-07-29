'use strict';

import * as extend from 'extend';
import * as debuglog from 'debug';

import { ConfigType, IConfig, IResult, IOptions } from '../types';

const debug = debuglog('config-profiler:managers:config');

export function prepare(type: ConfigType, path: string, ctime: number, config: object): IConfig {
	return { type, path, ctime, config };
}

export function build(type: ConfigType, path: string, config: object, options: IOptions): IResult {
	let from = 'settings';

	if (type === ConfigType.Predefined) {
		from = 'predefined';
	}

	if (type === ConfigType.File) {
		from = path;
	}

	if (options.extendBuildedConfig) {
		config = extend(true, config, options.extendBuildedConfig);
	}

	const buildedConfig = options.transform({ from, config });

	debug(`Builded config: %o`, buildedConfig);

	return buildedConfig;
}
