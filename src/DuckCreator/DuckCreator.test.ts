import * as path from 'path';

import * as utils from '../utils/fs-async-utils';
import { IConfig } from '../models/config.interface';
import { DuckCreator } from './DuckCreator';
import { DuckExistsError } from '../errors/duck-exists.error';

jest.mock('path');
jest.mock('../utils/fs-async-utils');

const wrkspcroot = 'unit/test/root';

const testconfig: IConfig = {
  ext: '.js',
  root: 'src/state/ducks',
  files: ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'],
  additionalFiles: ['one'],
  createRoot: true
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('should create a duck root folder', async () => {
  jest.spyOn(path, 'join').mockReturnValue(`${wrkspcroot}/${testconfig.root}`);
  jest.spyOn(utils, 'exists').mockResolvedValue(false);
  jest.spyOn(utils, 'mkdir').mockResolvedValue(null);

  const creator = new DuckCreator(wrkspcroot, testconfig);

  await creator.createRoot();

  expect(path.join).toHaveBeenCalled();
  expect(utils.exists).toHaveBeenCalled();
  expect(utils.mkdir).toHaveBeenCalled();
});

test('should not create if duck root exists', async () => {
  jest.spyOn(path, 'join').mockReturnValue(`${wrkspcroot}/${testconfig.root}`);
  jest.spyOn(utils, 'exists').mockResolvedValue(true);
  jest.spyOn(utils, 'mkdir');

  const creator = new DuckCreator(wrkspcroot, testconfig);

  await creator.createRoot();

  expect(path.join).toHaveBeenCalled();
  expect(utils.exists).toHaveBeenCalled();
  expect(utils.mkdir).not.toHaveBeenCalled();
});

test('should throw error if duck exists', async () => {
  jest.spyOn(path, 'join').mockReturnValue('abs/path/ducks/darkwing');
  jest.spyOn(path, 'basename').mockReturnValue('darkwing');
  jest.spyOn(utils, 'exists').mockResolvedValue(true);

  const creator = new DuckCreator(wrkspcroot, testconfig);

  try {
    await creator.create('darkwing');

    fail('unexpected success block');
  } catch (err) {
    expect(err).toBeInstanceOf(DuckExistsError);
    expect(err.message).toBe(`'darkwing' already exists`);
  }

  expect(path.join).toHaveBeenCalled();
  expect(path.basename).toHaveBeenCalled();
  expect(utils.exists).toHaveBeenCalled();
});

test('should check if a relative path duck exists', async () => {
  const root = 'abs/path/ducks';
  const duck = 'darkwing';
  const abspath = `${wrkspcroot}/${root}/${duck}`;

  jest.spyOn(path, 'join').mockReturnValue(abspath);
  jest.spyOn(path, 'basename').mockReturnValue(duck);
  jest.spyOn(utils, 'exists').mockResolvedValue(true);

  const creator = new DuckCreator(wrkspcroot, testconfig);

  try {
    await creator.create(`${root}/${duck}`);

    fail('unexpected success block');
  } catch (err) {
    expect(err).toBeInstanceOf(DuckExistsError);
    expect(err.message).toBe(`'darkwing' already exists`);
  }

  expect(path.join).toHaveBeenCalledWith(wrkspcroot, `${root}/${duck}`);
  expect(path.basename).toHaveBeenCalled();
  expect(utils.exists).toHaveBeenCalled();
});

test('when creating a duck, should create duck root if config.createRoot is true', async () => {
  const config: IConfig = {
    ext: '.js',
    root: 'src/state/ducks',
    files: [],
    additionalFiles: [],
    createRoot: true
  };

  const creator = new DuckCreator(wrkspcroot, config);

  jest.spyOn(creator, 'createRoot').mockResolvedValue(null);

  await creator.create('darkwing');

  expect(creator.createRoot).toHaveBeenCalled();
});

test('should create the duck with the given configs', async () => {
  const config: IConfig = {
    ext: '.js',
    root: 'src/duck/root',
    files: ['index', 'reducers'],
    additionalFiles: ['two', 'more'],
    createRoot: false
  };

  const duck = 'darkwing';
  const duckpath = `${config.root}/${duck}`;
  const numberOfFiles = config.files.length + config.additionalFiles.length;

  jest.spyOn(path, 'join').mockReturnValue(duckpath);
  jest.spyOn(utils, 'exists').mockResolvedValue(false);
  jest.spyOn(utils, 'mkdir').mockResolvedValue(null);
  jest.spyOn(utils, 'writeFile').mockResolvedValue(null);

  const creator = new DuckCreator(wrkspcroot, config);

  await creator.create('darkwing');

  expect(utils.exists).toHaveBeenCalled();
  expect(utils.mkdir).toHaveBeenCalledWith(duckpath);
  expect(utils.writeFile).toHaveBeenCalledTimes(numberOfFiles);
});
