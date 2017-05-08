declare module "parse-json" {
	function parseJson(input: string, reviver?: Function, filename?: string): object;
	function parseJson(input: string, filename?: string): object;

	namespace parseJson { }

	export = parseJson;
}
