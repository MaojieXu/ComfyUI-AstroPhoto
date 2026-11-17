module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/ui/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/ui/tsconfig.json' }] },
  setupFilesAfterEnv: ['<rootDir>/ui/src/__tests__/setupTests.ts'],
  moduleNameMapper: { '^comfy:app$': '<rootDir>/ui/src/__tests__/hostMock.ts' },
  clearMocks: true
};
