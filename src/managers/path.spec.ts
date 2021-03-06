'use strict';

import * as assert from 'assert';
import * as path from 'path';

import * as proxyquire from 'proxyquire';

describe('Managers → Path', () => {
	let manager: any;

	const cwd = process.cwd().replace(/\\/g, '/');
	const resolve = (filepath: string) => path.resolve(filepath).replace(/\\/g, '/');

	before(() => {
		manager = proxyquire('./path', {
			os: {
				homedir: () => '/as-home-directory'
			}
		});
	});

	describe('.resolve', () => {
		it('should resolve relative path without cwd', () => {
			assert.equal(manager.resolve(null, './dir/file.txt'), `${cwd}/dir/file.txt`);
			assert.equal(manager.resolve(null, '../dir/file.txt'), resolve(`${cwd}/../dir/file.txt`));
		});

		it('should expand relative path with cwd', () => {
			assert.equal(manager.resolve('cwd', './dir/file.txt'), `${cwd}/cwd/dir/file.txt`);
			assert.equal(manager.resolve('cwd', '../dir/file.txt'), `${cwd}/dir/file.txt`);
		});

		it('should work with filepath with HOME symbol', () => {
			assert.equal(manager.resolve(null, '~/file.txt'), '/as-home-directory/file.txt');
		});

		it('should work with absolute filepath', () => {
			assert.equal(manager.resolve(null, '/file.txt'), '/file.txt');
		});
	});
});
