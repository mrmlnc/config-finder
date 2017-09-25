'use strict';

import * as debuglog from 'debug';

import * as configManager from '../managers/config';

import { ConfigType, IConfig, IOptions } from '../types';

const debug = debuglog('config-profiler:services:parser');

function isPackageFile(filepath: string, config: object, options: IOptions): boolean {
	return config && options.props.package && filepath.endsWith('package.json');
}

function getPackageProperty(config: Record<string, any>, options: IOptions): object {
	return config[options.props.package];
}

function getSyntaxErrorMessage(errors: Error[]): string {
	return 'No one parser could not parse file. See log for more details: ' + JSON.stringify(errors);
}

export function parse(content: string, filepath: string, ctime: number, options: IOptions): IConfig {
	// Try to parse file with defined parsers
	let config;
	const errors: Error[] = [];
	for (let i = 0; i < options.parsers.length; i++) {
		const item = options.parsers[i];

		// Apply the current parser pattern to filepath
		if (!options.useEachParser && !item.pattern.test(filepath)) {
			continue;
		}

		try {
			config = item.parser(content);

			debug(`Founded config was parsed by parser #${i} with the follow pattern: %o`, item.pattern);

			break;
		} catch (err) {
			errors.push(err.toString());
		}
	}

	// If it is a "package.json" file then extract config from "packageProp" property
	if (isPackageFile(filepath, config, options)) {
		config = getPackageProperty(config, options);
	}

	if (!config) {
		const message = getSyntaxErrorMessage(errors);
		throw new SyntaxError(message);
	}

	return configManager.prepare(ConfigType.File, filepath, ctime, config);
}
