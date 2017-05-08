'use strict';

import * as path from 'path';

import * as extend from 'extend';

import * as parserService from './parser';

import * as io from '../utils/io';
import * as pathManager from '../managers/path';

import { Cache, IOptions } from '../types';

export async function include(cache: Cache, filepath: string, options: IOptions): Promise<object> {
	let isStop = false;
	let currentPath = filepath;

	const configs: object[] = [];

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
				configs.push(cachedConfig.config);
			}
		}

		// Parse content
		const content = await io.readFile(currentPath);
		const parsedContent = parserService.parse(content, currentPath, stats.ctime.getTime(), options);

		const extendsPath = parsedContent.config[options.extendsProp];

		cache.set(currentPath, parsedContent);

		// Delete "extends" property for builded config
		if (options.extendsProp) {
			delete parsedContent.config.extends;
		}

		configs.push(parsedContent.config);

		// Try to find "extends" property
		if (options.extendsProp && extendsPath) {
			// Try to get config from predefined configs
			const predefinedConfig = options.predefinedConfigs[extendsPath];
			if (predefinedConfig) {
				configs.push(predefinedConfig);
				break;
			}

			const currentDir = path.dirname(currentPath);
			currentPath = pathManager.resolve(currentDir, extendsPath);
			continue;
		}

		isStop = true;
		break;
	}

	// Build config from dirty configs
	let i = configs.length - 1;
	let buildedConfig = {};
	while (i >= 0) {
		buildedConfig = extend(true, buildedConfig, configs[i]);
		i--;
	}

	return buildedConfig;
}
