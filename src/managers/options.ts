'use strict';

import * as parseJson from 'parse-json';
import * as requireFromString from 'require-from-string';

import { IOptions } from '../types';

export function prepare(options: IOptions): IOptions {
	options = Object.assign(<IOptions>{
		settings: null,
		predefinedConfigs: {},
		configFiles: [],
		parsers: [],
		useEachParser: false,
		transform: (value) => value,
		envVariableName: null,
		allowHomeDirectory: true
	}, options);

	options.props = Object.assign({
		package: null,
		extends: 'extends'
	}, options.props);

	// If "packageProp" property is defined then check the availability "package.json"
	// _file in the "configFiles" property
	if (options.props.package && options.configFiles.indexOf('package.jgon') === -1) {
		options.configFiles.push('package.json');
	}

	// Merge user defined parsers with default parsers
	options.parsers = options.parsers.concat([
		{ pattern: /.*(json|rc)$/, parser: parseJson },
		{ pattern: /.*(js|rc)$/, parser: requireFromString }
	]);

	return options;
}
