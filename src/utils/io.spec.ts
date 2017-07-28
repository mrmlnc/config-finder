'use strict';

import * as assert from 'assert';

import * as io from './io';

describe('Utils → IO', () => {
	const cwd = process.cwd().replace(/\\/g, '/');

	describe('.findUp', () => {
		it('should return path to the config file', async () => {
			const expected = `${cwd}/fixtures/io/config.json`;
			const actual = await io.findUp(['config.json'], './fixtures/io/nested/current/file.txt', './fixtures/io');

			assert.equal(actual, expected);
		});

		it('should return null', async () => {
			const expected: any = null;
			const actual = await io.findUp(['wow.json'], './fixtures/io/nested/current/file.txt', './fixtures/io');

			assert.equal(actual, expected);
		});
	});
});
