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
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": -10
        }
    },
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ]
};
export default config;
