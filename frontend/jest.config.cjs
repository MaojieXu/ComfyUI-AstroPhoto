module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/ui/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/ui/tsconfig.json' }] },
  setupFilesAfterEnv: ['<rootDir>/ui/src/__tests__/setupTests.ts'],
  moduleNameMapper: {
    '^comfy:app$': '<rootDir>/ui/src/__tests__/hostMock.ts',
    '\\.css$': '<rootDir>/ui/src/__tests__/styleMock.cjs',
    '/vendor/comfyui/single-select/SingleSelect\\.vue$': '<rootDir>/ui/src/__tests__/singleSelectMock.ts',
    '/vendor/comfyui/multi-select/MultiSelect\\.vue$': '<rootDir>/ui/src/__tests__/multiSelectMock.ts'
  },
  clearMocks: true
};
