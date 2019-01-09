
import * as path from 'path';

import { commands, workspace, window, ExtensionContext } from 'vscode';

import { getWorkspaceFolder } from './utils/workspace-util';
import { getConfig } from './utils/config-util';

import { DuckGenerator } from './generators/duck-generator';
import { IGenerator } from './generators/generator.interface';
import { IConfig } from './models/config.interface';

import extCommands from './commands';
import baseConfig from './base-config';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const workspaceRoot: string = getWorkspaceFolder(workspace.workspaceFolders);
  const configPath: string = path.resolve(workspaceRoot, 'ducks.config.js');
  const options: IConfig = getConfig(configPath, baseConfig);
  const generator: IGenerator = new DuckGenerator(workspaceRoot, window, options);

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
