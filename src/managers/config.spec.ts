'use strict';

import * as assert from 'assert';

import * as manager from './config';

import { ConfigType, IOptions } from '../types';

describe('Managers → Config', () => {
	const options: IOptions = {
		transform: (value) => value,
		extendBuildedConfig: null
	};

	describe('.prepare', () => {
		it('Should return prepared config', () => {
			const expected = {
				type: ConfigType.File,
				path: 'path',
				ctime: 0,
				config: { ok: true }
			};

			const actual = manager.prepare(ConfigType.File, 'path', 0, { ok: true });

			assert.deepEqual(actual, expected);
		});
	});

	describe('.build', () => {
		it('Should return builded config from settings', () => {
			const expected = {
				from: 'settings',
				config: { ok: true }
			};

			const actual = manager.build(ConfigType.Settings, null, { ok: true }, options);

			assert.deepEqual(actual, expected);
		});

		it('Should return builded config from predefined configs', () => {
			const expected = {
				from: 'predefined',
				config: { ok: true }
			};

			const actual = manager.build(ConfigType.Predefined, null, { ok: true }, options);

			assert.deepEqual(actual, expected);
		});

		it('Should return builded config from file', () => {
			const expected = {
				from: 'path',
				config: { ok: true }
			};

			const actual = manager.build(ConfigType.File, 'path', { ok: true }, options);

			assert.deepEqual(actual, expected);
		});

		it('Should merge builded config with provided object', () => {
			const expected = {
				from: 'path',
				config: {
					ok: true,
					nested: { ok: true }
				}
			};

			options.extendBuildedConfig = {
				nested: { ok: true }
			};

			const actual = manager.build(ConfigType.File, 'path', { ok: true }, options);

			assert.deepEqual(actual, expected);
		});
	});
});
