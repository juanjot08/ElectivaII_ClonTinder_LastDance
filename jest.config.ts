import type { Config } from 'jest';

const config: Config = {
	// Usa ts-jest para transformar TypeScript
	preset: 'ts-jest',
	testEnvironment: 'node',

	// Solo ejecuta pruebas en archivos .ts dentro de /test
	testMatch: ['**/test/**/*.spec.ts'],

	// Prioriza TypeScript antes que JS
	moduleFileExtensions: ['ts', 'js'],

	// Ignora carpeta dist
	roots: ['<rootDir>/src', '<rootDir>/test'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	collectCoverageFrom: [
		'src/**/*.ts', 
		'!src/**/*.d.ts', 
		'!src/infrastructure/**', 
		'!src/presentation/**', 
		'!src/application/dependencyInjection/**',
		'!src/application/interfaces/dtos/**'
	],
	testPathIgnorePatterns: ['<rootDir>/dist/'],
	coverageDirectory: 'coverage',
};

export default config;