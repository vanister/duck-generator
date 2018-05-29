import * as path from 'path';
import * as fs from 'fs';

import { InputBoxOptions, window } from "vscode";
import { IDisposable } from './disposable.interface';
import { DuckExistsError } from './errors/duck-exists.error';

export class DuckGenerator implements IDisposable {
  private readonly extension: string = '.js';
  private readonly duckFiles: string[] = ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'];

  constructor(
    private workspaceRoot: string,
  ) { }

  async execute() {
    // prompt for the name of the duck, or the path to create the duck in
    const duckname: string | undefined = await this.prompt();

    if (!duckname) {
      return;
    }

    const absoluteDuckPath: string = await this.toPath(duckname);

    try {
      this.create(absoluteDuckPath);
    } catch (err) {
      // log?
      
    }
  }

  async prompt(): Promise<string | undefined> {
    const options: InputBoxOptions = {
      ignoreFocusOut: true,
      prompt: `Duck name: 'some_duck', or a relative path: 'src/state/ducks/some_duck'`,
      placeHolder: 'quack',
      validateInput: this.validate
    };

    return await window.showInputBox(options);
  }

  create(absoluteDuckPath: string) {
    if (fs.existsSync(absoluteDuckPath)) {
      const duck: string = path.basename(absoluteDuckPath);

      throw new DuckExistsError(duck);
    }

    try {
      // create the directory
      fs.mkdirSync(absoluteDuckPath);

      this.duckFiles.forEach((file: string) => {
        const filename = `${file}${this.extension}`;
        const fullpath = path.join(absoluteDuckPath, filename);

        fs.writeFileSync(fullpath, `/* ${filename} */`);
      });
    } catch (err) {
      // log other than console?
      console.log('Error', err.message);

      throw err;
    }
  }

  validate(name: string) {
    if (!name) {
      return 'Name is required';
    }

    if (name.includes(' ')) {
      return 'Spaces are not allowed';
    }

    // no errors
    return null;
  }

  toPath(name: string): string {
    // simple test for slashes in string
    if (/\/|\\/.test(name)) {
      return path.resolve(this.workspaceRoot, name);
    }
    // if it's just the name of the duck, assume that it'll be in 'src/state/ducks/'
    return path.resolve(this.workspaceRoot, 'src/state/ducks/', name);
  }

  dispose(): void {
    console.log('disposing...');
  }
}