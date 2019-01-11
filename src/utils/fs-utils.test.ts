import { exists, mkdir } from './fs-utils';

jest.mock('util', () => ({
  promisify: (_: any) => _
}));

jest.mock('fs', () => ({
  exists: 'existsfn',
  mkdir: 'mkdirfn'
}));

beforeEach(() => {
  jest.resetAllMocks();
});

test('should return a promisified version of fs.exists', () => {
  expect(exists).toBe('existsfn');
});

test('should return a promisified version of fs.mkdir', () => {
  expect(mkdir).toBe('mkdirfn');
});
