import * as path from 'path';

import { InputBoxOptions, window } from "vscode";


export class DuckGenerator {
  constructor(
    private workspaceRoot: string,
  ) { }

  execute() {
    // prompt for the name of the duck, or the path to create the duck in
    this.prompt()
      .then((duckname: string) => {

      });
  }

  prompt(): Thenable<string> {
    const options: InputBoxOptions = {
      ignoreFocusOut: true,
      prompt: `Name: 'some_duck', or path: 'path/of/some_duck'`,
      validateInput: this.validate
    };

    return window.showInputBox(options)
      .then(name => this.toPath(name || 'some_duck'));
  }

  validate(name: string) {
    if (!name) {
      return 'Name is required';
    }

    if (name.includes(' ')) {
      return 'Spaces are not allowed';
    }

    return null;
  }

  toPath(name: string): string {
    // test for slashes in string
    if (/\/|\\/.test(name)) {
      return path.resolve(this.workspaceRoot, name);
    }

    return path.resolve(this.workspaceRoot, 'src/state/ducks/', name);
  }
}