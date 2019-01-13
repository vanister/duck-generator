import { DuckGenerator } from './DuckGenerator';
import { DuckExistsError } from '../errors/duck-exists.error';
// const mockPrompt = jest.fn();
// const mockWindow = {
//   showInformationMessage: jest.fn().mockResolvedValue('msg'),
//   showErrorMessage: jest.fn().mockResolvedValue('err_msg'),
// };

// const mockDuckCreator = {
//   create: jest.fn().mockResolvedValue(null)
// };

beforeEach(() => {
  jest.resetAllMocks();
});

test('should construct a DuckGenerator', () => {
  const generator = new DuckGenerator({} as any, {} as any, jest.fn());

  expect(generator).toBeDefined();
});

test('should not execute if duckname is not provied', async () => {
  const prompt = jest.fn().mockResolvedValue(null);
  const window = jest.fn();
  const creator = jest.fn();

  const generator = new DuckGenerator(window as any, creator as any, prompt);

  await generator.execute();

  expect(prompt).toHaveBeenCalled();
  expect(window).not.toHaveBeenCalled();
  expect(creator).not.toHaveBeenCalled();
});

test('should execute successful flow', async () => {
  const prompt = jest.fn().mockResolvedValue('darkwing');
  const creator = {
    create: jest.fn().mockResolvedValue(null)
  };

  const window = {
    showInformationMessage: jest.fn().mockResolvedValue('msg'),
  };

  const generator = new DuckGenerator(window as any, creator as any, prompt);

  await generator.execute();

  expect(creator.create).toHaveBeenCalledWith('darkwing');
  expect(window.showInformationMessage).toHaveBeenCalledWith(`Duck: 'darkwing' successfully created`);
});

test('should show a duck exists message on error', async () => {
  const prompt = jest.fn().mockResolvedValue('darkwing');
  const creator = {
    create: jest.fn().mockRejectedValue(new DuckExistsError())
  };

  const window = {
    showErrorMessage: jest.fn().mockResolvedValue('msg'),
  };

  const generator = new DuckGenerator(window as any, creator as any, prompt);

  await generator.execute();

  expect(window.showErrorMessage).toHaveBeenCalledWith(`Duck: 'darkwing' already exists`);
});

test('should show a generic error message', async () => {
  const prompt = jest.fn().mockResolvedValue('darkwing');
  const creator = {
    create: jest.fn().mockRejectedValue(new Error('generic'))
  };

  const window = {
    showErrorMessage: jest.fn().mockResolvedValue('msg'),
  };

  const generator = new DuckGenerator(window as any, creator as any, prompt);

  await generator.execute();

  expect(window.showErrorMessage).toHaveBeenCalledWith(`Error: generic`);
});
