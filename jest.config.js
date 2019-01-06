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
    'src/tests/index.ts',
  ],
  testMatch: [
    '**/src/tests/**/*.+(ts|js)',
  ],
  preset: 'ts-jest',
}
