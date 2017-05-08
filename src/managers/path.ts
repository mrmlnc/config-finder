'use strict';

import * as os from 'os';
import * as path from 'path';

export function resolve(cwd: string, filepath: string): string {
	let fullpath = filepath;

	if (!path.isAbsolute(filepath)) {
		fullpath = path.resolve(cwd ? cwd : '', filepath);
	}

	// Expand HOME directory symbol to full path
	if (filepath.startsWith('~')) {
		fullpath = path.join(os.homedir(), filepath.substr(1));
	}

	return fullpath.replace(/\\/g, '/');
}
