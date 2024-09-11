import typescript from "@rollup/plugin-typescript";

export default {
	input: "./app.ts",
	output: {
		file: "./dist/bundle.js",
		format: "es",
		sourcemap: true,
	},
	plugins: [typescript()],
	external: [
		"express",
		"mongoose",
		"dotenv",
		"cookie-parser",
		"cors",
		"url",
		"jsonwebtoken",
		"lodash",
		"bcrypt",
		"@faker-js/faker",
		"nanoid",
	],
};
