'use strict';

import * as locatePath from 'locate-path';

import * as io from '../utils/io';

import * as configManager from '../managers/config';
import * as pathManager from '../managers/path';
import * as configService from '../services/config';

import { Cache, ConfigType, IOptions, IResult } from '../types';

function isString(arg: any): arg is string {
	return typeof arg === 'string';
}

function isObject(arg: any): arg is object {
	return typeof arg === 'object';
}

function isEmptyObject(arg: object): boolean {
	return Object.keys(arg).length === 0;
}

function isPredefinedConfig(predefinedConfigs: object, configName: string): boolean {
	return predefinedConfigs.hasOwnProperty(configName);
}

function linkToHome(filepath: string): string {
	return pathManager.resolve(null, `~/${filepath}`);
}

export async function scan(cache: Cache, cwd: string, filepath: string, options: IOptions): Promise<IResult> {
	// Try to use config from editor settings
	const settings = options.settings;
	if (settings && isObject(settings) && !isEmptyObject(settings)) {
		return configManager.build(ConfigType.Settings, null, settings, options);
	}

	// Try to use predefined config
	const predefinedConfigs = options.predefinedConfigs;
	if (settings && isString(settings) && isPredefinedConfig(predefinedConfigs, settings)) {
		return configManager.build(ConfigType.Predefined, null, predefinedConfigs[settings], options);
	}

	// Try to include config by defined filepath in the settings
	if (settings && isString(settings)) {
		const configPath = pathManager.resolve(cwd, settings);
		const config = await configService.include(cache, configPath, options);
		if (config) {
			return configManager.build(ConfigType.File, configPath, config, options);
		}
	}

	// Try to use config by env
	const envProp = options.envVariableName;
	if (envProp && process.env[envProp]) {
		const configPath = process.env[envProp];
		const config = await configService.include(cache, configPath, options);
		if (config) {
			return configManager.build(ConfigType.File, configPath, config, options);
		}
	}

	// Try to find config in the workspace and HOME directories
	let findedConfigPath = await io.findUp(options.configFiles, filepath, cwd);
	if (!findedConfigPath && options.allowHomeDirectory) {
		findedConfigPath = await locatePath(options.configFiles.map(linkToHome), {});
	}

	if (findedConfigPath) {
		const config = await configService.include(cache, findedConfigPath, options);
		if (config) {
			return configManager.build(ConfigType.File, findedConfigPath, config, options);
		}
	}

	return null;
}
