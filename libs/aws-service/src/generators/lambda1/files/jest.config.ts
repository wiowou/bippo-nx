/* eslint-disable */
export default {
  displayName: '<%= projectName %>',
  preset: '<%= rootOffset %>jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<%= rootOffset %>coverage/apps/<%= projectName %>',
};
