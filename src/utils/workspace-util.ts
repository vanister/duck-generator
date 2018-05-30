import { WorkspaceFolder } from "vscode";

export const getWorkspaceFolder = (folders: WorkspaceFolder[] | undefined): string => {
  if (!folders) {
    return '';
  }

  const folder = folders[0] || {};
  const uri = folder.uri;

  return uri.fsPath;
};
