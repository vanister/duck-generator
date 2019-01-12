import { promptUsing } from './duck-prompts';
import { InputBoxOptions } from 'vscode';

const mockWindow: any = {
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
  showInputBox: jest.fn()
};

const testoptions: InputBoxOptions = {
  ignoreFocusOut: true,
  prompt: 'Duck name',
  placeHolder: 'darkwing_duck',
  validateInput: jest.fn(() => null)
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('should return a function to show prompt', () => {
  const prompt = promptUsing(mockWindow, testoptions);

  expect(prompt).toBeInstanceOf(Function);
});

test('should return a function with default base options', () => {
  const prompt = promptUsing(mockWindow);

  expect(prompt).toBeInstanceOf(Function);
});

test('should show a prompt for duckname', async () => {
  const window: any = {
    showInputBox: jest.fn().mockResolvedValue('darkwing')
  };

  const prompt = promptUsing(window, testoptions);
  const name = await prompt();

  expect(name).toBe('darkwing');
  expect(window.showInputBox).toHaveBeenCalled();
});

test('should validate prompt input', async () => {
  let validateCalled = false;

  const options: any = {};
  const window: any = {
    showInputBox: (opt: any) => {
      // must call this fn to be considered successful
      expect(opt.validateInput('darkwing')).toBeNull();
      expect(opt.validateInput('')).toBe('A value is required');
      expect(opt.validateInput('dark wing')).toBe('Spaces are not allowed');

      validateCalled = true;
    }
  };

  const prompt = promptUsing(window, options);

  await prompt();

  expect(validateCalled).toBe(true);
});

test('should show a prompt with overrides', async () => {
  const options: InputBoxOptions = {
    placeHolder: 'test',
    ignoreFocusOut: true,
    validateInput: null as any,
    prompt: 'prompted'
  };

  const window: any = {
    showInputBox: jest.fn().mockResolvedValue('tested')
  };

  const prompt = promptUsing(window, options);

  await prompt();

  expect(window.showInputBox).toHaveBeenCalledWith(options);
});
