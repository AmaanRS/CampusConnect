// jest.config.ts
import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
	testEnvironment: "node",
	verbose: true,
	preset: "ts-jest/presets/default-esm", // or other ESM presets
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},

	// A map from regular expressions to paths to transformers
	transform: {
		// '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts"],
	clearMocks: true,

	// The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
	maxWorkers: "50%",
	moduleFileExtensions: ["js", "ts", "json", "node"],
	resetMocks: true,

	// The root directory that Jest should scan for tests and modules within
	rootDir: "./Tests",

	// A list of paths to directories that Jest should use to search for files in
	roots: ["<rootDir>"],

	// The glob patterns Jest uses to detect test files
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
	setupFiles: ["<rootDir>/test-setup.ts"],
	testTimeout: 100000,
};

export default jestConfig;
