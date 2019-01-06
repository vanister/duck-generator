module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  testPathIgnorePatterns: [
    // these are the default tests samples provided by vscode
    // ignoring this because we're using Jest and storing our
    // unit tests next to our file under test
    'src/test/'
  ],
  testMatch: [
    '**/src/**/*.test.+(ts|js)',
  ],
  preset: 'ts-jest',
}
