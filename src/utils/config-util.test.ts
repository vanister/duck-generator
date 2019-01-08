import * as fs from 'fs';
import * as path from 'path';

import { getConfig } from './config-util';
import { IOptions, IOptionOverrides } from '../models/options.interface';

jest.mock('fs');
jest.mock('path');

const baseoptions: IOptions = {
  ext: '.js',
  root: 'test/src',
  files: ['sample'],
  additionalFiles: ['one-more']
};

const root = '../test/';
const file = 'ducks.config.js';
const configPath = `${root}${file}`;

test('should throw an error if base options are null or undefined', () => {
  let undefinedOptions: any;
  let nullOptions: any = null;

  expect(() => { getConfig(nullOptions); }).toThrowError('baseOptions');
  expect(() => { getConfig(undefinedOptions); }).toThrowError('baseOptions');
  expect(() => { getConfig(baseoptions); }).not.toThrowError('baseOptions');
});

test('should throw an error if object is empty', () => {
  expect(() => { getConfig({} as any); }).toThrowError('baseOptions');
});

test('should throw an error if not an object', () => {
  expect(() => { getConfig('object' as any); }).toThrowError('baseOptions');
});

test('should return a function wrapping the options', () => {
  const withBaseOptions = getConfig(baseoptions);

  expect(typeof withBaseOptions).toBe('function');
});

test('should return the base config if config file is not found', () => {
  jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  jest.spyOn(path, 'resolve').mockReturnValue('does/not/exist/file.js');

  const withBaseOptions = getConfig(baseoptions);
  const retrievedOptions = withBaseOptions('does/not/exist/', 'file.js');

  expect(retrievedOptions).toEqual(baseoptions);
  expect(fs.existsSync).toHaveBeenCalledWith('does/not/exist/file.js');
  expect(path.resolve).toHaveBeenCalledWith('does/not/exist/', 'file.js');
});

test('should return the options from config file', () => {
  const configOptions: IOptionOverrides = {
    ext: '.js',
    root: 'test/root',
    files: ['test', 'mock'],
    additionalFiles: ['two', 'files']
  };

  jest.spyOn(path, 'resolve').mockReturnValue(configPath);
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);

  const withBaseOptions = getConfig(baseoptions);
  const options = withBaseOptions(root, file);

  expect(options).toEqual(configOptions);
  expect(path.resolve).toHaveBeenCalledWith(root, file);
  expect(fs.existsSync).toHaveBeenCalledWith(configPath);
});

test('should return merged options if config contains partial settings', () => {
  const partialOptions = {
    ext: '.ts',
    additionalFiles: ['only-one']
  };

  jest.spyOn(path, 'resolve').mockReturnValue(configPath);
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);

  jest.doMock(configPath, () => partialOptions);

  const withBaseOptions = getConfig(baseoptions);
  const options = withBaseOptions(root, file);

  const expectedOptions = {
    ext: '.ts',
    root: 'test/src',
    files: ['sample'],
    additionalFiles: ['only-one']
  };

  expect(options).toEqual(expectedOptions);
  expect(path.resolve).toHaveBeenCalledWith(root, file);
  expect(fs.existsSync).toHaveBeenCalledWith(configPath);
});
