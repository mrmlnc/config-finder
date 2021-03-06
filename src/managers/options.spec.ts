'use strict';

import * as assert from 'assert';

import * as manager from './options';

import * as Types from '../types';

describe('Managers → Options', () => {
	const makeOptions = (options: Types.IOptions) => {
		options = Object.assign({
			cache: true,
			settings: null,
			predefinedConfigs: {},
			configFiles: [],
			useEachParser: false,
			envVariableName: null,
			allowHomeDirectory: true,
			extendBuildedConfig: null
		}, options);

		options.props = Object.assign({
			package: null,
			extends: 'extends'
		}, options.props);

		return options;
	};

	describe('.merge', () => {
		it('should merge changeable options', () => {
			const options = {
				allowHomeDirectory: false,
				settings: { ok: true }
			};

			const expected = makeOptions(options);

			const actual = manager.mergeChangeable(makeOptions({}), options);

			delete actual.parsers;
			delete actual.transform;

			assert.deepEqual(actual, expected);
		});
	});

	describe('.prepare', () => {
		it('Should work with empty object', () => {
			const expected = makeOptions({});

			const actual = manager.prepare({});

			assert.equal(actual.parsers.length, 2);

			delete actual.parsers;
			delete actual.transform;

			assert.deepEqual(actual, expected);
		});

		it('Should work with defined "packageProp" property', () => {
			const expected = makeOptions({ configFiles: ['package.json'], props: { package: 'name' } });
			const actual = manager.prepare({ props: { package: 'name' } });

			assert.equal(actual.parsers.length, 2);

			delete actual.parsers;
			delete actual.transform;

			assert.deepEqual(actual, expected);
		});

		it('Should work with defined users "parsers" property', () => {
			const expected = makeOptions({});
			const actual = manager.prepare({
				parsers: [
					{ pattern: /test/, parser: <T>(value: T): T => value }
				]
			});

			assert.equal(actual.parsers.length, 3);
			assert.equal(actual.parsers[0].pattern.source, 'test');

			delete actual.parsers;
			delete actual.transform;

			assert.deepEqual(actual, expected);
		});
	});
});
