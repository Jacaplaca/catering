const jestConfig = {
    clearMocks: true,
    coverageProvider: "v8",
    preset: "ts-jest/presets/js-with-ts",
    setupFiles: ["dotenv/config"],
    transform: {
        // "^.+\\.mjs$": ["ts-jest", {
        //     useESM: true,
        //     tsconfig: 'tsconfig.jest.json',
        //     diagnostics: {
        //         ignoreCodes: [2345, 2339, 7006, 7019]
        //     }
        // }],
        "^.+\\.(ts|tsx|mts)$": ["ts-jest", {
            useESM: true,
            tsconfig: 'tsconfig.jest.json',
            diagnostics: {
                ignoreCodes: [2345, 2339, 7006, 7019]
            }
        }]
    },
    transformIgnorePatterns: [
        "node_modules/(?!superjson)"
    ],
    moduleNameMapper: {
        '^@root/(.*)$': '<rootDir>/$1',
        '^app/(.*)$': '<rootDir>/app/$1',
        '^server/(.*)$': '<rootDir>/app/server/$1',
        '^@auth/prisma-adapter$': '<rootDir>/src/__mocks__/@auth/prisma-adapter.js',
        '^@openai$': '<rootDir>/src/__mocks__/openai/index.js'
    },
    moduleDirectories: [
        "node_modules",
        // "<rootDir>/node_modules",
        // "<rootDir>/src"
    ],
    testMatch: [
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    extensionsToTreatAsEsm: [".ts", ".tsx", ".mts"],
    verbose: true
};

export default jestConfig;
