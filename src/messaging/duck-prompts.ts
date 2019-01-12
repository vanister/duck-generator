import { VSCodeWindow } from "../vscode.interfaces";
import { InputBoxOptions } from "vscode";

export function promptUsing(window: VSCodeWindow, options: InputBoxOptions = {}) {
  // this can be abstracted out as an argument for prompt
  const baseOptions: InputBoxOptions = Object.assign({}, {
    validateInput: validate
  }, options);

  return async function (overrides: InputBoxOptions = {}) {
    const finalOptions = Object.assign({}, baseOptions, overrides);

    return await window.showInputBox(finalOptions);
  };
}

function validate(name: string): string | null {
  if (!name) {
    return 'A value is required';
  }

  if (name.includes(' ')) {
    return 'Spaces are not allowed';
  }

  // no errors
  return null;
}
