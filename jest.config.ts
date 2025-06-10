import { createDefaultPreset } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import * as tsconfig from './tsconfig.json';

export default {
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  setupFilesAfterEnv: ['./src/test/setup.ts'],
  ...createDefaultPreset({
    tsconfig: './tsconfig.test.json',
  }),
  roots: ['<rootDir>'],
  modulePaths: [tsconfig.compilerOptions.baseUrl],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
};
