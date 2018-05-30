import * as fs from 'fs';
import * as path from 'path';

import { DuckExistError } from '../errors/duck-exist.error';
import { DuckGenerator } from '../duck-generator';

jest.mock('fs');
jest.mock('path');

describe('Duck Generator', () => {
  const testRoot = 'fake/path/to/test';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate user input', () => {
    const windowMock: any = {};

    const generator = new DuckGenerator(testRoot, windowMock);
    const name = 'unit_test';
    const nameWithSpace = 'unit space test';

    expect(generator.validate(<any>undefined)).toBe('Name is required');
    expect(generator.validate(nameWithSpace)).toBe('Spaces are not allowed');
    expect(generator.validate(name)).toBeNull();
  });

  it('should convert to a path string', () => {
    const windowMock: any = {};

    const generator = new DuckGenerator(testRoot, windowMock);
    const name = 'quack';
    const duckpath = 'some/path/to/quack';

    (<any>path.resolve).mockImplementation((...args: string[]) => args.join('/'));

    expect(generator.toPath(name)).toBe(`${testRoot}/src/state/ducks/${name}`);
    expect(generator.toPath(duckpath)).toBe(`${testRoot}/${duckpath}`);
  });

  it('should throw DuckExistError when creating a duck that already exists', () => {
    const windowMock: any = {};

    const generator = new DuckGenerator(testRoot, windowMock);
    const absDuckPath = 'full/path/to/duck/quack';

    const existsMock = (<any>fs.existsSync).mockReturnValue(true);
    const basenameMock = (<any>path.basename).mockReturnValue('quack');

    expect(() => { generator.create(absDuckPath); }).toThrowError(DuckExistError);

    expect(existsMock).toHaveBeenCalledWith(absDuckPath);
    expect(basenameMock).toHaveBeenCalledWith(absDuckPath);
  });

  it('should create a duck folder with files', () => {
    const windowMock: any = {};

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
    const windowMock = {
      showInputBox: jest.fn().mockResolvedValue('quack')
    };

    const generator = new DuckGenerator(testRoot, <any>windowMock);

    const input = await generator.prompt();

    expect(input).toBe('quack');
    expect(windowMock.showInputBox).toHaveBeenCalled();
  });

  it('should execute stop execution if duck name is undefined', async () => {
    const windowMock: any = {};

    const generator = new DuckGenerator(testRoot, windowMock);

    jest.spyOn(generator, 'prompt').mockResolvedValue(undefined);
    jest.spyOn(generator, 'toPath');
    jest.spyOn(generator, 'create');

    await generator.execute();

    expect(generator.prompt).toHaveBeenCalled();
    expect(generator.toPath).not.toHaveBeenCalled();
    expect(generator.create).not.toHaveBeenCalled();
  });

  it('should execute the duck creation flow', async () => {
    const windowMock = {
      showInformationMessage: jest.fn()
    };

    const generator = new DuckGenerator(testRoot, <any>windowMock);
    const duck = 'quack';

    jest.spyOn(generator, 'prompt').mockResolvedValue(duck);
    jest.spyOn(generator, 'toPath').mockReturnValue(`${testRoot}/${duck}`);
    jest.spyOn(generator, 'create');

    await generator.execute();

    expect(generator.prompt).toHaveBeenCalled();
    expect(generator.toPath).toHaveBeenCalledWith(duck);
    expect(generator.create).toHaveBeenCalledWith(`${testRoot}/${duck}`);
    expect(windowMock.showInformationMessage).toHaveBeenCalledWith(`Duck: '${duck}' successfully created`);
  });

  it('should catch duck exists error from duck creation flow', async () => {
    const windowMock = {
      showErrorMessage: jest.fn()
    };

    const generator = new DuckGenerator(testRoot, <any>windowMock);
    const duck = 'quack';

    jest.spyOn(generator, 'prompt').mockResolvedValue(duck);
    jest.spyOn(generator, 'toPath').mockReturnValue(`${testRoot}/${duck}`);
    jest.spyOn(generator, 'create').mockImplementation(() => { throw new DuckExistError(); });

    await generator.execute();

    expect(generator.prompt).toHaveBeenCalled();
    expect(generator.toPath).toHaveBeenCalledWith(duck);
    expect(generator.create).toHaveBeenCalledWith(`${testRoot}/${duck}`);
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(`Duck: '${duck}' already exists`);
  });
});