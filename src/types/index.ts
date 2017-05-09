'use strict';

export type Cache = Map<string, IConfig>;

export enum ConfigType {
	File,
	Settings,
	Predefined
}

export interface IConfig {
	path: string;
	ctime: number;
	type: ConfigType;
	config: {
		[prop: string]: any
	};
}

export interface IResult {
	from: string;
	config: object;
}

export interface IParser {
	pattern: RegExp;
	parser: Function;
}

export interface IOptions {
	/**
	 * For example, editor settings.
	 */
	settings?: object | string;
	/**
	 * Predefined configs.
	 */
	predefinedConfigs?: object;
	/**
	 * The names of the files that can be used as a configs.
	 */
	configFiles?: string[];
	/**
	 * Parsers that apply to the found configs.
	 */
	parsers?: IParser[];
	/**
	 * Allow to use each parser to config file.
	 * Necessary in the case that a single file can have multiple syntaxes.
	 */
	useEachParser?: boolean;
	/**
	 * A function that returns the result.
	 */
	transform?: (result: IResult) => IResult;
	/**
	 * Allow to get path to config from env.
	 */
	envVariableName?: string;
	/**
	 * Allow configs in the HOME directory.
	 */
	allowHomeDirectory?: boolean;
	/**
	 * Set of field names.
	 */
	props?: {
		/**
		 * The name of property in the package.json file.
		 */
		package?: string;
		/**
		 * Allow to use "extends" property inside config files or settings. Also works with predefined configs.
		 * For example:
		 *  - config.json: { "extends": "./base.json", "ok": false }
		 *  - base.json { "ok": true }
		 *  - result: { "ok": false }
		 */
		extends?: string;
	};
	/**
	 * Merge builded config with passed object.
	 */
	extendBuildedConfig?: object;
}
