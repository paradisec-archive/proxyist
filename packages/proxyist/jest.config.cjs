/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.[t]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
}
