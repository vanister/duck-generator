//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

import { getWorkspaceFolder } from '../extension';

suite('Extension', () => {
  const folders: any[] = [{ uri: { fsPath: 'path/to/unit/test/' } }];

  test('should return empty string if workspace folders are empty', () => {
    const wsRoot = getWorkspaceFolder(undefined);

    assert.equal(wsRoot, '');
  });

  test('should return workspace root path', () => {
    const wsRoot = getWorkspaceFolder(folders);

    assert.equal(wsRoot, 'path/to/unit/test/');
  });
});