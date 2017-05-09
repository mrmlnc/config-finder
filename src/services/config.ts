'use strict';

import * as path from 'path';

import * as extend from 'extend';

import * as parserService from './parser';

import * as io from '../utils/io';
import * as pathManager from '../managers/path';

import { Cache, IOptions } from '../types';

function hasExtendsProperty(config: object, options: IOptions): boolean {
	return config.hasOwnProperty(options.props.extends);
}

function getExtendsPath(config: object, options: IOptions): string {
	return config[options.props.extends];
}

export async function include(cache: Cache, filepath: string, options: IOptions): Promise<object> {
	let isStop = false;

	let currentConfig;
	let currentPath = filepath;

	const stack: object[] = [];

	while (!isStop) {
		const exists = await io.existsPath(currentPath);
		if (!exists) {
			throw new Error('A file that does not exist: ' + currentPath);
		}

		// Try to use cached config
		const stats = await io.statPath(currentPath);
		if (cache.has(currentPath)) {
			const cachedConfig = cache.get(currentPath);

			if (cachedConfig.ctime >= stats.ctime.getTime()) {
				currentConfig = cachedConfig;
			}
		}

		// Try to read config from File System
		if (!currentConfig) {
			const content = await io.readFile(currentPath);
			currentConfig = parserService.parse(content, currentPath, stats.ctime.getTime(), options);

			cache.set(currentPath, currentConfig);
		}

		stack.push(currentConfig.config);

		// Try to find "extends" property
		if (hasExtendsProperty(currentConfig.config, options)) {
			const extendsPath = getExtendsPath(currentConfig.config, options);

			// Try to get config from predefined configs
			const predefinedConfig = options.predefinedConfigs[extendsPath];
			if (predefinedConfig) {
				stack.push(predefinedConfig);
				break;
			}

			// Resolve path to config for next iteration
			const currentDir = path.dirname(currentPath);
			currentPath = pathManager.resolve(currentDir, extendsPath);
			currentConfig = null;

			continue;
		}

		isStop = true;
		currentConfig = null;
	}

	// Build config from dirty configs
	let buildedConfig = { extends: null };
	while (stack.length) {
		buildedConfig = extend(true, buildedConfig, stack.pop());
	}

	// Delete "extends" property for builded config
	if (options.props.extends) {
		delete buildedConfig.extends;
	}

	return buildedConfig;
}
