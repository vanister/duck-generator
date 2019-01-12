import { exists, mkdir, writeFile } from './fs-async-utils';

jest.mock('util', () => ({
  promisify: (_: any) => _
}));

jest.mock('fs', () => ({
  exists: 'existsfn',
  mkdir: 'mkdirfn',
  writeFile: 'writeFilefn'
}));

beforeEach(() => {
  jest.resetAllMocks();
});

test('should promisify fs.exist', () => {
  expect(exists).toBe('existsfn');
});

test('should promisify fs.mkdir', () => {
  expect(mkdir).toBe('mkdirfn');
});

test('should promisify fs.writeFile', () => {
  expect(writeFile).toBe('writeFilefn');
});
