module.exports = {
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    }
  },
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  testMatch: [
    "**/src/tests/**/*.+(ts|js)"
  ],
  testPathIgnorePatterns: [
    "src/tests/index.ts"
  ]
};
