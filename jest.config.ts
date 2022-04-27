import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    "transform": {
        "\\.[jt]sx?$": "ts-jest",
    },
    collectCoverage: true,
    coverageThreshold: {
        "global": {
            "branches": 50,
            "functions": 37,
            "lines": 50,
            "statements": -55
        }
    },
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ]
};
export default config;
