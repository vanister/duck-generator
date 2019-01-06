import * as path from 'path';
import * as fs from 'fs';

import { InputBoxOptions } from 'vscode';
import { DuckExistError } from '../errors/duck-exist.error';
import { VSCodeWindow } from '../vscode.interfaces';
import { IGenerator } from './generator.interface';
import { IOptionOverrides, IOptions } from '../models/options.interface';

export class DuckGenerator implements IGenerator {
  readonly options: IOptions = {
    root: 'src/state/ducks',
    ext: '.js',
    files: ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'],
    additionalFiles: []
  };

  constructor(
    private readonly workspaceRoot: string,
    private readonly window: VSCodeWindow,
    overrides: IOptionOverrides = {}
  ) {
    this.options = Object.assign({}, this.options, overrides);
  }

  async execute(): Promise<void> {
    // prompt for the name of the duck, or the path to create the duck in
    const duckname: string | undefined = await this.prompt();

    if (!duckname) {
      return;
    }

    const absoluteDuckPath: string = this.toAbsolutePath(duckname);

    try {
      this.create(absoluteDuckPath);

      this.window.showInformationMessage(`Duck: '${duckname}' successfully created`);
    } catch (err) {
      // log?
      if (err instanceof DuckExistError) {
        this.window.showErrorMessage(`Duck: '${duckname}' already exists`);
      } else {
        this.window.showErrorMessage(`Error: ${err.message}`);
      }
    }
  }

  async prompt(): Promise<string | undefined> {
    // this can be abstracted out as an argument for prompt
    const options: InputBoxOptions = {
      ignoreFocusOut: true,
      prompt: `Duck name: 'some_duck', or a relative path: 'src/state/ducks/some_duck'`,
      placeHolder: 'darkwing_duck',
      validateInput: this.validate
    };

    return await this.window.showInputBox(options);
  }

  create(absoluteDuckPath: string) {
    if (fs.existsSync(absoluteDuckPath)) {
      const duck: string = path.basename(absoluteDuckPath);

      throw new DuckExistError(`'${duck}' already exists`);
    }

    try {
      const { files, ext, additionalFiles } = this.options;
      const duckFiles = [
        ...files,
        ...additionalFiles
      ];

      // create the directory
      fs.mkdirSync(absoluteDuckPath);

      duckFiles.forEach((file: string) => {
        const filename = `${file}${ext}`;
        const fullpath = path.join(absoluteDuckPath, filename);

        fs.writeFileSync(fullpath, `/* ${filename} */`);
      });
    } catch (err) {
      // log other than console?
      console.log('Error:', err.message);

      throw err;
    }
  }

  validate(name: string): string | null {
    if (!name) {
      return 'Name is required';
    }

    if (name.includes(' ')) {
      return 'Spaces are not allowed';
    }

    // no errors
    return null;
  }

  toAbsolutePath(nameOrRelativePath: string): string {
    // simple test for slashes in string
    if (/\/|\\/.test(nameOrRelativePath)) {
      return path.resolve(this.workspaceRoot, nameOrRelativePath);
    }

    const { root } = this.options;

    // if it's just the name of the duck, assume that it'll be in 'src/state/ducks/'
    return path.resolve(this.workspaceRoot, root, nameOrRelativePath);
  }

  dispose(): void {
    console.log('disposing...');
  }
}
