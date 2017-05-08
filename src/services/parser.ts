'use strict';

import * as configManager from '../managers/config';

import { ConfigType, IConfig, IOptions } from '../types';

export function parse(content: string, filepath: string, ctime: number, options: IOptions): IConfig {
	// Try to parse file with defined parsers
	let config;
	const errors = [];
	for (let i = 0; i < options.parsers.length; i++) {
		const item = options.parsers[i];

		// Apply the current parser pattern to filepath
		if (!options.useEachParser && !item.pattern.test(filepath)) {
			continue;
		}

		try {
			config = item.parser(content);
			break;
		} catch (err) {
			errors.push(err.toString());
		}
	}

	// If it is a "package.json" file then extract config from "packageProp" property
	if (config && options.packageProp && filepath.endsWith('package.json')) {
		config = config[options.packageProp];
	}

	if (!config) {
		throw new SyntaxError('No one parser could not parse file. See log for more details: ' + JSON.stringify(errors));
	}

	return configManager.prepare(ConfigType.File, filepath, ctime, config);
}