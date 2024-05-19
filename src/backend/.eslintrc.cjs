module.exports = {
	root: true,
	env: {
		browser: true,
		es2020: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			arrowFunctions: true,
			blockBindings: true,
			classes: true,
			destructuring: true,
			forOf: true,
			jsx: true,
			spread: true,
		},
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
