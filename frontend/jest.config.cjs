module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass|svg|png|jpg)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [151001, 1295]
      },
      tsconfig: {
        jsx: 'react-jsx',
        module: 'CommonJS',
        esModuleInterop: true,
        allowJs: true,
        allowSyntheticDefaultImports: true
      }
    }]
  }
};
