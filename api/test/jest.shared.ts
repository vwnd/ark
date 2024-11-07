export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@app/shared/(.*)': '<rootDir>/../libs/shared/src/$1',
    '@app/shared': '<rootDir>/../libs/shared/src',
  },
  setupFiles: ['<rootDir>/test/jest.setup.ts'],
};
