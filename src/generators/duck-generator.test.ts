import * as fs from 'fs';
import * as path from 'path';

import { DuckExistsError } from '../errors/duck-exists.error';
import { DuckGenerator } from './duck-generator';
import { IConfig } from '../models/config.interface';

jest.mock('fs');
jest.mock('path');

const testRoot = 'fake/path/to/test';
const windowMock: any = jest.fn();

const testoptions: IConfig = {
  ext: '.js',
  root: 'src/state/ducks',
  files: ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'],
  additionalFiles: [],
  createRoot: true
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('should construct with default options', () => {
  const generator = new DuckGenerator(testRoot, windowMock, testoptions);

  const expectedOptions: IConfig = {
    ext: '.js',
    root: 'src/state/ducks',
    files: ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'],
    additionalFiles: [],
    createRoot: true
  };

  expect(generator.config).toEqual(expectedOptions);
});

test('should construct with overriden options', () => {
  const options: IConfig = {
    ext: '.ts',
    root: 'src/state',
    files: ['index'],
    additionalFiles: ['reducers', 'test'],
    createRoot: true
  };

  const generator = new DuckGenerator(testRoot, windowMock, options);

  expect(generator.config).toEqual(options);
});

test('should validate user input', () => {
  const generator = new DuckGenerator(testRoot, windowMock, testoptions);
  const name = 'unit_test';
  const nameWithSpace = 'unit space test';

  expect(generator.validate(<any>undefined)).toBe('Name is required');
  expect(generator.validate(nameWithSpace)).toBe('Spaces are not allowed');
  expect(generator.validate(name)).toBeNull();
});

test('should convert to a path string', () => {
  const generator = new DuckGenerator(testRoot, windowMock, testoptions);
  const name = 'quack';
  const duckpath = 'some/path/to/quack';

  (<any>path.resolve).mockImplementation((...args: string[]) => args.join('/'));

  expect(generator.toAbsolutePath(name)).toBe(`${testRoot}/src/state/ducks/${name}`);
  expect(generator.toAbsolutePath(duckpath)).toBe(`${testRoot}/${duckpath}`);
});

test('should throw DuckExistError when creating a duck that already exists', () => {
  const generator = new DuckGenerator(testRoot, windowMock, testoptions);
  const absDuckPath = 'full/path/to/duck/quack';

  const existsMock = (<any>fs.existsSync).mockReturnValue(true);
  const basenameMock = (<any>path.basename).mockReturnValue('quack');

  expect(() => { generator.create(absDuckPath); }).toThrowError(DuckExistsError);

  expect(existsMock).toHaveBeenCalledWith(absDuckPath);
  expect(basenameMock).toHaveBeenCalledWith(absDuckPath);
});

test('should create a duck folder with files', () => {
  const generator = new DuckGenerator(testRoot, windowMock, testoptions);
  const absDuckPath = 'full/path/to/duck/quack';

  (<any>fs.existsSync).mockReturnValue(false);
  (<any>path.join).mockImplementation((...args: string[]) => args.join('/'));

  generator.create(absDuckPath);

  expect(fs.existsSync).toHaveBeenCalledWith(absDuckPath);
  expect(fs.mkdirSync).toHaveBeenCalledWith(absDuckPath);
  expect(fs.writeFileSync).toHaveBeenCalledTimes(7);
  expect(path.join).toHaveBeenCalledTimes(7);
});

test('should promt user for input', async () => {
  const mockWindow: any = {
    showInputBox: jest.fn().mockResolvedValue('quack')
  };

  const generator = new DuckGenerator(testRoot, mockWindow, testoptions);

  const input = await generator.prompt();

  expect(input).toBe('quack');
  expect(mockWindow.showInputBox).toHaveBeenCalled();
});

test('should execute stop execution if duck name is undefined', async () => {
  const generator = new DuckGenerator(testRoot, windowMock, testoptions);

  jest.spyOn(generator, 'prompt').mockResolvedValue(undefined);
  jest.spyOn(generator, 'toAbsolutePath');
  jest.spyOn(generator, 'create');

  await generator.execute();

  expect(generator.prompt).toHaveBeenCalled();
  expect(generator.toAbsolutePath).not.toHaveBeenCalled();
  expect(generator.create).not.toHaveBeenCalled();
});

test('should execute the duck creation flow', async () => {
  const mockWindow: any = {
    showInformationMessage: jest.fn()
  };

  const generator = new DuckGenerator(testRoot, mockWindow, testoptions);
  const duck = 'quack';

  jest.spyOn(generator, 'prompt').mockResolvedValue(duck);
  jest.spyOn(generator, 'toAbsolutePath').mockReturnValue(`${testRoot}/${duck}`);
  jest.spyOn(generator, 'create');

  await generator.execute();

  expect(generator.prompt).toHaveBeenCalled();
  expect(generator.toAbsolutePath).toHaveBeenCalledWith(duck);
  expect(generator.create).toHaveBeenCalledWith(`${testRoot}/${duck}`);
  expect(mockWindow.showInformationMessage).toHaveBeenCalledWith(`Duck: '${duck}' successfully created`);
});

test('should catch duck exists error from duck creation flow', async () => {
  const mockWindow: any = {
    showErrorMessage: jest.fn()
  };

  const generator = new DuckGenerator(testRoot, mockWindow, testoptions);
  const duck = 'quack';

  jest.spyOn(generator, 'prompt').mockResolvedValue(duck);
  jest.spyOn(generator, 'toAbsolutePath').mockReturnValue(`${testRoot}/${duck}`);
  jest.spyOn(generator, 'create').mockImplementation(() => { throw new DuckExistsError(); });

  await generator.execute();

  expect(generator.prompt).toHaveBeenCalled();
  expect(generator.toAbsolutePath).toHaveBeenCalledWith(duck);
  expect(generator.create).toHaveBeenCalledWith(`${testRoot}/${duck}`);
  expect(mockWindow.showErrorMessage).toHaveBeenCalledWith(`Duck: '${duck}' already exists`);
});
