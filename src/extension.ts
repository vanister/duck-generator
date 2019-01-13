
import * as path from 'path';

import { commands, workspace, window, ExtensionContext } from 'vscode';

import { DuckGenerator } from './DuckGenerator/DuckGenerator';
import { DuckCreator } from './DuckCreator/DuckCreator';
import { IGenerator } from './DuckGenerator/generator.interface';
import { IConfig } from './models/config.interface';

import { getWorkspaceFolder } from './utils/workspace-util';
import { getConfig } from './utils/config-util';

import { promptUsing } from './messaging/duck-prompts';

import extCommands from './commands';
import baseConfig from './base-config';
import inputOptions from './input-box-options';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const workspaceRoot: string = getWorkspaceFolder(workspace.workspaceFolders);
  const configPath: string = path.join(workspaceRoot, 'ducks.config.js');
  const config: IConfig = getConfig(configPath, baseConfig);
  const creator = new DuckCreator(workspaceRoot, config);
  const prompt = promptUsing(window, inputOptions);

  const generator: IGenerator = new DuckGenerator(window, creator, prompt);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(extCommands.generateDucks, async () => {
    // The code you place here will be executed every time your command is executed
    await generator.execute();
  });

  // subscribe disposable to extension deactivation event
  context.subscriptions.push(disposable, generator);
}

// this method is called when your extension is deactivated
export function deactivate() { }
