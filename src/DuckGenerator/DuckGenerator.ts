import { DuckExistsError } from '../errors/duck-exists.error';
import { VSCodeWindow } from '../vscode.interfaces';
import { IGenerator } from './generator.interface';
import { DuckCreator } from '../DuckCreator/DuckCreator';
import { InputBoxOptions } from 'vscode';

export class DuckGenerator implements IGenerator {
  constructor(
    private readonly window: VSCodeWindow,
    private readonly duckCreator: DuckCreator,
    private readonly prompt: ((overrides?: InputBoxOptions) => Promise<string | undefined>)
  ) { }

  async execute(): Promise<void> {
    // prompt for the name of the duck, or the path to create the duck in
    const duckname: string | undefined = await this.prompt();

    if (!duckname) {
      return;
    }

    try {
      await this.duckCreator.create(duckname);

      await this.window.showInformationMessage(`Duck: '${duckname}' successfully created`);
    } catch (err) {
      // log?
      if (err instanceof DuckExistsError) {
        await this.window.showErrorMessage(`Duck: '${duckname}' already exists`);
      } else {
        await this.window.showErrorMessage(`Error: ${err.message}`);
      }
    }
  }

  dispose(): void {
    // console.log('disposing...');
  }
}
