declare module "require-from-string" {
	interface IOptions {
		appendPaths: any[];
		prependPaths: any[];
	}

	function requireFromString(code: string, filepath?: string, options?: IOptions): any;

	namespace requireFromString { }

	export = requireFromString;
}
