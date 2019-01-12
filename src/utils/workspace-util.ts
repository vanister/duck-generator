import { WorkspaceFolder } from 'vscode';

function getWorkspaceFolder(folders: WorkspaceFolder[] | undefined): string {
  if (!folders) {
    return '';
  }

  const folder = folders[0];
  const uri = folder.uri;

  return uri.fsPath;
}

export {
  getWorkspaceFolder
};
