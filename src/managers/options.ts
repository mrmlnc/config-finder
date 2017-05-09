'use strict';

import * as extend from 'extend';

import * as parseJson from 'parse-json';
import * as requireFromString from 'require-from-string';

import { IOptions } from '../types';

function extendDefault(options: IOptions): IOptions {
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

export function merge(previous: IOptions, current: IOptions): IOptions {
	const options = extend(true, previous, current);

	return extendDefault(options);
}

export function prepare(options: IOptions): IOptions {
	options = Object.assign(<IOptions>{
		settings: null,
		predefinedConfigs: {},
		configFiles: [],
		parsers: [],
		useEachParser: false,
		transform: (value) => value,
		envVariableName: null,
		allowHomeDirectory: true,
		extendBuildedConfig: null
	}, options);

	options.props = Object.assign({
		package: null,
		extends: 'extends'
	}, options.props);

	return extendDefault(options);
}
