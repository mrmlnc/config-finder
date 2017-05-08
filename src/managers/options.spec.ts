'use strict';

import * as assert from 'assert';

import * as manager from './options';

describe('Managers → Options', () => {
	describe('.prepare', () => {
		const makeOptions = (options: object) => {
			return Object.assign({
				settings: null,
				predefinedConfigs: {},
				packageProp: null,
				configFiles: [],
				useEachParser: false,
				extendsProp: 'extends',
				envVariableName: null,
				allowHomeDirectory: true
			}, options);
		};

		it('Should work with empty object', () => {
			const expected = makeOptions({});

			const actual = manager.prepare({});

			assert.equal(actual.parsers.length, 2);

			delete actual.parsers;
			delete actual.transform;

			assert.deepEqual(actual, expected);
		});

		it('Should work with defined "packageProp" property', () => {
			const expected = makeOptions({ packageProp: 'name', configFiles: ['package.json'] });
			const actual = manager.prepare({ packageProp: 'name' });

			assert.equal(actual.parsers.length, 2);

			delete actual.parsers;
			delete actual.transform;

			assert.deepEqual(actual, expected);
		});

		it('Should work with defined users "parsers" property', () => {
			const expected = makeOptions({});
			const actual = manager.prepare({
				parsers: [
					{ pattern: /test/, parser: (value) => value }
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
