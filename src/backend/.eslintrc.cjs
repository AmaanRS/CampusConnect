module.exports = {
	root: true,
	env: {
		browser: true,
		es2020: true,
		es6: true,
		jest: true,
		mocha: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: null,
	},
	rules: {
		"array-callback-return": ["off", {}],
		curly: ["error"],
		"dot-location": ["error", null],
		"dot-notation": [
			"error",
			{
				allowKeywords: true,
				allowPattern: "",
			},
		],
	},
};
