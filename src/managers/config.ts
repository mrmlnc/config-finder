'use strict';

import { ConfigType, IConfig, IResult, IOptions } from '../types';

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

	return options.transform({ from, config });
}
