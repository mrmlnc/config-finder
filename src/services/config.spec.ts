'use strict';

import * as assert from 'assert';

import * as proxyquire from 'proxyquire';

import * as optionsManager from '../managers/options';

describe('Services → Config', () => {
	let service: any;

	const cache = new Map();
	const cwd = process.cwd().replace(/\\/g, '/');

	before(() => {
		const pathManager = proxyquire('../managers/path', {
			os: {
				homedir: () => `${cwd}/fixtures/scanner/home`
			}
		});

		service = proxyquire('./config', {
			'../managers/path': pathManager
		});
	});

	describe('.include', () => {
		it('Should return config for filepath', async () => {
			const options = optionsManager.prepare({
				predefinedConfigs: {
					default: { last: 3, default: true }
				}
			});
			const filepath = './fixtures/config/one.json';

			const expected = { last: 0, three: true, two: true, one: true, default: true };

			const actual = await service.include(cache, filepath, options);

			assert.deepEqual(actual, expected);
		});

		it('Should return config without expand "extends" property', async () => {
			const options = optionsManager.prepare({ props: { extends: null } });
			const filepath = './fixtures/config/one.json';

			const expected = { extends: './two.json', last: 0, one: true };

			const actual = await service.include(cache, filepath, options);

			assert.deepEqual(actual, expected);
		});

		it('Should throw error if path does not a exist', async () => {
			const options = optionsManager.prepare({});
			const filepath = './fixtures/config/error.json';

			try {
				await service.include(cache, filepath, options);
				throw new Error('Magic? There must be an error.');
			} catch (err) {
				assert.equal(err.message, `A file that does not exist: ${cwd}/fixtures/config/four.json`);
			}
		});
	});

});
