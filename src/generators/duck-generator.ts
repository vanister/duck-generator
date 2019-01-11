import * as path from 'path';
import * as fs from 'fs';

import { InputBoxOptions } from 'vscode';
import { DuckExistsError } from '../errors/duck-exists.error';
import { VSCodeWindow } from '../vscode.interfaces';
import { IGenerator } from './generator.interface';
import { IConfig } from '../models/config.interface';

export class DuckGenerator implements IGenerator {
  constructor(
    private readonly workspaceRoot: string,
    private readonly window: VSCodeWindow,
    readonly config: IConfig
  ) { }

  async execute(): Promise<void> {
    // prompt for the name of the duck, or the path to create the duck in
    const duckname: string | undefined = await this.prompt();

    if (!duckname) {
      return;
    }

    const absoluteDuckPath: string = this.toAbsolutePath(duckname);

    try {
      this.createDuckRoot();
      this.create(absoluteDuckPath);

      this.window.showInformationMessage(`Duck: '${duckname}' successfully created`);
    } catch (err) {
      // log?

      if (err instanceof DuckExistsError) {
        this.window.showErrorMessage(`Duck: '${duckname}' already exists`);
      } else {
        this.window.showErrorMessage(`Error: ${err.message}`);
      }
    }
  }

  dispose(): void {
    // console.log('disposing...');
  }

  async prompt(): Promise<string | undefined> {
    // this can be abstracted out as an argument for prompt
    const inputOptions: InputBoxOptions = {
      ignoreFocusOut: true,
      prompt: `Duck name: 'some_duck', or a relative path: 'src/state/ducks/some_duck'`,
      placeHolder: 'darkwing_duck',
      validateInput: this.validate
    };

    return await this.window.showInputBox(inputOptions);
  }

  createDuckRoot(): void {
    const duckRoot = path.join(this.workspaceRoot, this.config.root);

    if (fs.existsSync(duckRoot)) {
      return;
    }

    fs.mkdirSync(duckRoot);
  }

  create(absoluteDuckPath: string): void {
    if (fs.existsSync(absoluteDuckPath)) {
      const duck: string = path.basename(absoluteDuckPath);

      throw new DuckExistsError(`'${duck}' already exists`);
    }

    const { files, ext, additionalFiles } = this.config;
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

    const { root } = this.config;

    // if it's just the name of the duck, assume that it'll be in
    return path.resolve(this.workspaceRoot, root, nameOrRelativePath);
  }
}
