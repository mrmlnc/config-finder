'use strict';

import * as assert from 'assert';

import * as proxyquire from 'proxyquire';

import * as optionsManager from '../managers/options';

describe('Services → Scanner', () => {
	let service: any;

	const cache = new Map();
	const cwd = process.cwd().replace(/\\/g, '/');

	before(() => {
		const pathManager = proxyquire('../managers/path', {
			os: {
				homedir: () => `${cwd}/fixtures/scanner/home`
			}
		});

		service = proxyquire('./scanner', {
			'../managers/path': pathManager
		});
	});

	describe('.scan', () => {
		it('Should return config from settings', async () => {
			const options = optionsManager.prepare({
				settings: { from: 'settings' }
			});

			const expected = {
				from: 'settings',
				config: { from: 'settings' }
			};

			const actual = await service.scan(cache, cwd, null, options);

			assert.deepEqual(actual, expected);
		});

		it('Should return config from predefined configs by config name in the settings', async () => {
			const options = optionsManager.prepare({
				settings: 'name',
				predefinedConfigs: {
					name: { from: 'predefined' }
				}
			});

			const expected = {
				from: 'predefined',
				config: { from: 'predefined' }
			};

			const actual = await service.scan(cache, cwd, null, options);

			assert.deepEqual(actual, expected);
		});

		it('Should return config from file by path in the settings', async () => {
			const options = optionsManager.prepare({
				settings: '~/config.home.json'
			});

			const expected = {
				from: `${cwd}/fixtures/scanner/home/config.home.json`,
				config: { from: 'home/config.home.json' }
			};

			const actual = await service.scan(cache, cwd, null, options);

			assert.deepEqual(actual, expected);
		});

		it('Should return config from file by path in the env', async () => {
			const configPath = `${cwd}/fixtures/scanner/home/config.home.json`;
			const options = optionsManager.prepare({
				envVariableName: 'ENV_CONFIG_NAME'
			});

			process.env.ENV_CONFIG_NAME = configPath;

			const expected = {
				from: configPath,
				config: { from: 'home/config.home.json' }
			};

			const actual = await service.scan(cache, cwd, null, options);

			assert.deepEqual(actual, expected);
		});

		it('Should return config for current file', async () => {
			const options = optionsManager.prepare({
				configFiles: ['config.json']
			});

			const expected = {
				from: `${cwd}/fixtures/scanner/nested/config.json`,
				config: { from: 'nested/config.json' }
			};

			const actual = await service.scan(cache, cwd, 'fixtures/scanner/nested/current/index.txt', options);

			assert.deepEqual(actual, expected);
		});

		it('Should return config for current file by "packageProp" property in the "package.json"', async () => {
			const options = optionsManager.prepare({
				props: { package: 'propertyName' }
			});

			const expected = {
				from: `${cwd}/fixtures/scanner/package.json`,
				config: { from: 'package.json' }
			};

			const actual = await service.scan(cache, cwd, 'fixtures/scanner/nested/current/index.txt', options);

			assert.deepEqual(actual, expected);
		});

		it('Should return config for current file from HOME directory', async () => {
			const options = optionsManager.prepare({
				configFiles: ['config.home.json']
			});

			const expected = {
				from: `${cwd}/fixtures/scanner/home/config.home.json`,
				config: { from: 'home/config.home.json' }
			};

			const actual = await service.scan(cache, cwd, 'fixtures/scanner/nested/current/index.txt', options);

			assert.deepEqual(actual, expected);
		});

		it('Should return null, because we cannot use HOME directory', async () => {
			const options = optionsManager.prepare({
				configFiles: ['config.home.json'],
				allowHomeDirectory: false
			});

			const expected: any = null;

			const actual = await service.scan(cache, cwd, 'fixtures/scanner/nested/current/index.txt', options);

			assert.deepEqual(actual, expected);
		});

		it('Should return null, because package.json has no property', async () => {
			const options = optionsManager.prepare({
				cache: false,
				props: { package: 'nonExistsPropertyName' }
			});

			const expected: any = null;

			const actual = await service.scan(cache, cwd, 'fixtures/scanner/nested/current/index.txt', options);

			assert.equal(actual, expected);
		});

		it('Should return null', async () => {
			const options = optionsManager.prepare({
				configFiles: ['config.non-exist.json']
			});

			const expected: any = null;

			const actual = await service.scan(cache, cwd, 'fixtures/scanner/nested/current/index.txt', options);

			assert.deepEqual(actual, expected);
		});
	});
});
