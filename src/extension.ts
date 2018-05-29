
import { commands, workspace, ExtensionContext, WorkspaceFolder } from 'vscode';
import { DuckGenerator } from './duck-generator';

export const getWorkspaceFolder = (folders: WorkspaceFolder[] | undefined): string => {
  if (!folders) {
    return '';
  }

  const folder = folders[0] || {};
  const uri = folder.uri;

  return uri.fsPath;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  const workspaceRoot: string = getWorkspaceFolder(workspace.workspaceFolders);
  const generator = new DuckGenerator(workspaceRoot);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand('extension.generateDuck', () => {
    // The code you place here will be executed every time your command is executed
    generator.execute();
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(generator);
}

// this method is called when your extension is deactivated
export function deactivate() { }
