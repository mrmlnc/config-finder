'use strict';

import * as assert from 'assert';

import * as service from './parser';

import * as io from '../utils/io';
import * as optionsManager from '../managers/options';

function simpleIniParser(text: string): object {
	const lines = text.trim().split('\n');

	const config: any = {};
	lines.forEach((line) => {
		const leftRight = line.split('=');

		config[leftRight[0]] = leftRight[1];
	});

	return config;
}

describe('Services → Parser', () => {
	describe('.parse', () => {
		it('Should include config with JSON-syntax', async () => {
			const options = optionsManager.prepare({});
			const filepath = './fixtures/parser/.config-json';

			const expected = {
				type: 0,
				path: filepath,
				config: { ok: true }
			};

			const content = await io.readFile(filepath);
			const actual = await service.parse(content, filepath, 0, options);

			assert.ok(typeof actual.ctime === 'number');

			delete actual.ctime;

			assert.deepEqual(actual, expected);
		});

		it('Should include config with JS-syntax', async () => {
			const options = optionsManager.prepare({});
			const filepath = './fixtures/parser/.config-js';

			const expected = {
				type: 0,
				path: filepath,
				config: { ok: true }
			};

			const content = await io.readFile(filepath);
			const actual = await service.parse(content, filepath, 0, options);

			assert.ok(typeof actual.ctime === 'number');

			delete actual.ctime;

			assert.deepEqual(actual, expected);
		});

		it('Should include config with INI-syntax', async () => {
			const options = optionsManager.prepare({
				parsers: [
					{ pattern: /.*(ini)$/, parser: simpleIniParser }
				]
			});
			const filepath = './fixtures/parser/.config-ini';

			const expected = {
				type: 0,
				path: filepath,
				config: { ok: 'true' }
			};

			const content = await io.readFile(filepath);
			const actual = await service.parse(content, filepath, 0, options);

			assert.ok(typeof actual.ctime === 'number');

			delete actual.ctime;

			assert.deepEqual(actual, expected);
		});

		it('Should throw error if no one parser could not parser file', async () => {
			const options = optionsManager.prepare({
				useEachParser: true
			});
			const filepath = './fixtures/parser/.config';

			const content = await io.readFile(filepath);

			try {
				await service.parse(content, filepath, 0, options);
				throw new Error('Magic? There must be an error.');
			} catch (err) {
				assert.ok(err.message.startsWith('No one parser could not parse file. See log for more details:'));
			}
		});
	});
});
