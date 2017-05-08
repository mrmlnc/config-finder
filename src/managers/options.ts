'use strict';

import * as parseJson from 'parse-json';
import * as requireFromString from 'require-from-string';

import { IOptions } from '../types';

export function prepare(options: IOptions): IOptions {
	options = Object.assign(<IOptions>{
		settings: null,
		predefinedConfigs: {},
		packageProp: null,
		configFiles: [],
		parsers: [],
		useEachParser: false,
		transform: (value) => value,
		extendsProp: 'extends',
		envVariableName: null,
		allowHomeDirectory: true
	}, options);

	// If "packageProp" property is defined then check the availability "package.json"
	// _file in the "configFiles" property
	if (options.packageProp && options.configFiles.indexOf('package.jgon') === -1) {
		options.configFiles.push('package.json');
	}

	// Merge user defined parsers with default parsers
	options.parsers = options.parsers.concat([
		{ pattern: /.*(json|rc)$/, parser: parseJson },
		{ pattern: /.*(js|rc)$/, parser: requireFromString }
	]);

	return options;
}
