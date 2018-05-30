import * as assert from 'assert';

import { getWorkspaceFolder } from '../../utils/workspace-util';

describe('Extension', () => {
  const folders: any[] = [{ uri: { fsPath: 'path/to/unit/test/' } }];

  it('should return empty string if workspace folders are empty', () => {
    const wsRoot = getWorkspaceFolder(undefined);

    assert.equal(wsRoot, '');
  });

  it('should return workspace root path', () => {
    const wsRoot = getWorkspaceFolder(folders);

    assert.equal(wsRoot, 'path/to/unit/test/');
  });
});