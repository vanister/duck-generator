import * as fs from 'fs';

import { getConfig } from './config-util';
import { IConfig } from '../models/config.interface';

jest.mock('fs');
jest.mock('path');

const baseoptions: IConfig = {
  ext: '.js',
  root: 'test/src',
  files: ['sample'],
  additionalFiles: ['one-more'],
  createRoot: true
};

const configPath = '../test/ducks.config.js';

beforeEach(() => {
  jest.resetAllMocks();
});

test('should error if path is empty, null or undefined', () => {
  expect(() => { getConfig('', baseoptions); }).toThrowError('configPath');
  expect(() => { getConfig(null as any, baseoptions); }).toThrowError('configPath');
  expect(() => { getConfig(undefined as any, baseoptions); }).toThrowError('configPath');
});

test('should throw an error if base options are null or undefined', () => {
  let undefinedOptions: any;
  let nullOptions: any = null;

  expect(() => { getConfig(configPath, nullOptions); }).toThrowError('baseOptions');
  expect(() => { getConfig(configPath, undefinedOptions); }).toThrowError('baseOptions');
  expect(() => { getConfig(configPath, baseoptions); }).not.toThrowError('baseOptions');
});

test('should throw an error if object is empty', () => {
  expect(() => { getConfig(configPath, {} as any); }).toThrowError('baseOptions');
});

test('should throw an error if not an object', () => {
  expect(() => { getConfig(configPath, 'object' as any); }).toThrowError('baseOptions');
});

test('should return the base config if config file is not found', () => {
  jest.spyOn(fs, 'existsSync').mockReturnValue(false);

  const options = getConfig('does/not/exist/file.js', baseoptions);

  expect(options).toEqual(baseoptions);
  expect(fs.existsSync).toHaveBeenCalledWith('does/not/exist/file.js');
});

test('should return the options from config file', () => {
  const configOptions: IConfig = {
    ext: '.js',
    root: 'test/root',
    files: ['test', 'mock'],
    additionalFiles: ['two', 'files'],
    createRoot: true
  };

  jest.spyOn(fs, 'existsSync').mockReturnValue(true);

  const options = getConfig(configPath, baseoptions);

  expect(options).toEqual(configOptions);
  expect(fs.existsSync).toHaveBeenCalledWith(configPath);
});

test('should return merged options if config contains partial settings', () => {
  const partialOptions = {
    ext: '.ts',
    additionalFiles: ['only-one']
  };

  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.doMock(configPath, () => partialOptions);

  const options = getConfig(configPath, baseoptions);

  const expectedOptions = {
    ext: '.ts',
    root: 'test/src',
    files: ['sample'],
    additionalFiles: ['only-one'],
    createRoot: true
  };

  expect(options).toEqual(expectedOptions);
  expect(fs.existsSync).toHaveBeenCalledWith(configPath);
});
