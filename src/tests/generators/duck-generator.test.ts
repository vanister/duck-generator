import * as fs from 'fs';
import * as path from 'path';

import { DuckExistError } from '../../errors/duck-exist.error';
import { DuckGenerator } from '../../generators/duck-generator';
import { IOptionOverrides, IOptions } from '../../models/options.interface';

jest.mock('fs');
jest.mock('path');

describe('Duck Generator', () => {
  const testRoot = 'fake/path/to/test';
  const windowMock: any = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should construct with default options', () => {
    const generator = new DuckGenerator(testRoot, windowMock);

    const expectedOptions: IOptions = {
      ext: '.js',
      root: 'src/state/ducks',
      files: ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'],
      additionalFiles: []
    };

    expect(generator.options).toEqual(expectedOptions);
  });

  it('should construct with overriden options', () => {
    const options: IOptionOverrides = {
      ext: '.ts',
      root: 'src/state',
      files: ['index'],
      additionalFiles: ['reducers', 'test']
    };

    const generator = new DuckGenerator(testRoot, windowMock, options);

    expect(generator.options).toEqual(options);
  });

  it('should validate user input', () => {
    const generator = new DuckGenerator(testRoot, windowMock);
    const name = 'unit_test';
    const nameWithSpace = 'unit space test';

    expect(generator.validate(<any>undefined)).toBe('Name is required');
    expect(generator.validate(nameWithSpace)).toBe('Spaces are not allowed');
    expect(generator.validate(name)).toBeNull();
  });

  it('should convert to a path string', () => {
    const generator = new DuckGenerator(testRoot, windowMock);
    const name = 'quack';
    const duckpath = 'some/path/to/quack';

    (<any>path.resolve).mockImplementation((...args: string[]) => args.join('/'));

    expect(generator.toAbsolutePath(name)).toBe(`${testRoot}/src/state/ducks/${name}`);
    expect(generator.toAbsolutePath(duckpath)).toBe(`${testRoot}/${duckpath}`);
  });

  it('should throw DuckExistError when creating a duck that already exists', () => {
    const generator = new DuckGenerator(testRoot, windowMock);
    const absDuckPath = 'full/path/to/duck/quack';

    const existsMock = (<any>fs.existsSync).mockReturnValue(true);
    const basenameMock = (<any>path.basename).mockReturnValue('quack');

    expect(() => { generator.create(absDuckPath); }).toThrowError(DuckExistError);

    expect(existsMock).toHaveBeenCalledWith(absDuckPath);
    expect(basenameMock).toHaveBeenCalledWith(absDuckPath);
  });

  it('should create a duck folder with files', () => {
    const generator = new DuckGenerator(testRoot, windowMock);
    const absDuckPath = 'full/path/to/duck/quack';

    (<any>fs.existsSync).mockReturnValue(false);
    (<any>path.join).mockImplementation((...args: string[]) => args.join('/'));

    generator.create(absDuckPath);

    expect(fs.existsSync).toHaveBeenCalledWith(absDuckPath);
    expect(fs.mkdirSync).toHaveBeenCalledWith(absDuckPath);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(7);
    expect(path.join).toHaveBeenCalledTimes(7);
  });

  it('should promt user for input', async () => {
    const mockWindow = {
      showInputBox: jest.fn().mockResolvedValue('quack')
    };

    const generator = new DuckGenerator(testRoot, <any>mockWindow);

    const input = await generator.prompt();

    expect(input).toBe('quack');
    expect(mockWindow.showInputBox).toHaveBeenCalled();
  });

  it('should execute stop execution if duck name is undefined', async () => {
    const generator = new DuckGenerator(testRoot, windowMock);

    jest.spyOn(generator, 'prompt').mockResolvedValue(undefined);
    jest.spyOn(generator, 'toAbsolutePath');
    jest.spyOn(generator, 'create');

    await generator.execute();

    expect(generator.prompt).toHaveBeenCalled();
    expect(generator.toAbsolutePath).not.toHaveBeenCalled();
    expect(generator.create).not.toHaveBeenCalled();
  });

  it('should execute the duck creation flow', async () => {
    const mockWindow = {
      showInformationMessage: jest.fn()
    };

    const generator = new DuckGenerator(testRoot, <any>mockWindow);
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

  it('should catch duck exists error from duck creation flow', async () => {
    const mockWindow = {
      showErrorMessage: jest.fn()
    };

    const generator = new DuckGenerator(testRoot, <any>mockWindow);
    const duck = 'quack';

    jest.spyOn(generator, 'prompt').mockResolvedValue(duck);
    jest.spyOn(generator, 'toAbsolutePath').mockReturnValue(`${testRoot}/${duck}`);
    jest.spyOn(generator, 'create').mockImplementation(() => { throw new DuckExistError(); });

    await generator.execute();

    expect(generator.prompt).toHaveBeenCalled();
    expect(generator.toAbsolutePath).toHaveBeenCalledWith(duck);
    expect(generator.create).toHaveBeenCalledWith(`${testRoot}/${duck}`);
    expect(mockWindow.showErrorMessage).toHaveBeenCalledWith(`Duck: '${duck}' already exists`);
  });
});
