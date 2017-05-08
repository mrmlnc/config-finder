'use strict';

import * as path from 'path';
import * as fs from 'fs';

import * as locatePath from 'locate-path';

import * as pathManager from '../managers/path';

/**
 * Find a file by walking up parent directories.
 */
export async function findUp(files: string[], startFile: string, endDir: string): Promise<string> {
	endDir = pathManager.resolve(null, endDir);
	startFile = pathManager.resolve(null, startFile);

	const startDir = path.dirname(startFile);

	const findedFilepath: string = <any>await new Promise((resolve) => {
		(function find(dir) {
			locatePath(files, { cwd: dir }).then((file) => {
				if (file) {
					resolve(path.join(dir, file));
				} else if (dir === endDir) {
					resolve(null);
				} else {
					find(path.dirname(dir));
				}
			});
		})(startDir);
	});

	if (!findedFilepath) {
		return null;
	}

	return pathManager.resolve(null, findedFilepath);
}

export function statPath(filepath: string): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.stat(filepath, (err, stats) => {
			if (err) {
				return reject(err);
			}
			resolve(stats);
		});
	});
}

export function existsPath(filepath: string): Promise<boolean> {
	return new Promise((resolve) => {
		fs.access(filepath, (err) => resolve(!err));
	});
}

export function readFile(filepath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (err, data) => {
			if (err) {
				return reject(err);
			}
			resolve(data.toString());
		});
	});
}
