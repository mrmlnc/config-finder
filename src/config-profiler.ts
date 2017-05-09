'use strict';

import * as optionsManager from './managers/options';
import * as scannerService from './services/scanner';

import { IOptions, IChangeableOptions, IResult } from './types';

export default class ConfigProfiler {
	private readonly cache = new Map();

	constructor(private workspace: string, private options: IOptions) {
		this.options = optionsManager.prepare(options);
	}

	public setWorkspace(workspace: string) {
		this.workspace = workspace;
	}

	public setOptions(options: IOptions) {
		this.options = optionsManager.prepare(options);
	}

	public getConfig(filepath: string, options?: IChangeableOptions): Promise<IResult> {
		options = !options ? this.options : optionsManager.mergeChangeable(this.options, options);

		return scannerService.scan(this.cache, this.workspace, filepath, options);
	}
}
