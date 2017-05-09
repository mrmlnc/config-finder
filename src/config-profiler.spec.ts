'use strict';

import * as assert from 'assert';

import ConfigProfiler from './config-profiler';

describe('ConfigProfiler', () => {
	const cwd = process.cwd().replace(/\\/g, '/');

	it('Should return instanse of profiler', () => {
		const profiler = new ConfigProfiler('./fixtures', {});

		assert.ok(profiler instanceof ConfigProfiler);
	});

	it('Should set new workspace directory and options', async () => {
		const profiler = new ConfigProfiler('', { configFiles: ['wow.json'] });

		profiler.setWorkspace('./fixtures/scanner');
		profiler.setOptions({ configFiles: ['config.json'] });

		const expected = {
			from: `${cwd}/fixtures/scanner/nested/config.json`,
			config: { from: 'nested/config.json' }
		};

		const actual = await profiler.getConfig('./fixtures/scanner/nested/index.txt');

		assert.deepEqual(actual, expected);
	});

	it('should set new options from getConfig method', async () => {
		const profiler = new ConfigProfiler('', { configFiles: ['wow.json'] });

		const expected = {
			from: `${cwd}/fixtures/scanner/nested/config.json`,
			config: { from: 'nested/config.json' }
		};

		const actual = await profiler.getConfig('./fixtures/scanner/nested/index.txt', {
			configFiles: ['config.json']
		});

		assert.deepEqual(actual, expected);
	});
});
