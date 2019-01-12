import { InputBoxOptions } from "vscode";

const options: InputBoxOptions = {
  ignoreFocusOut: true,
  prompt: `Duck name: 'some_duck', or a relative path: 'src/state/ducks'`,
  placeHolder: 'darkwing_duck',
};

export default options;
