import * as assert from 'assert';

import { DuckExistsError } from '../../errors/duck-exists.error';

suite('Errors', () => {
  suite('DuckExistsError', () => {
    test('should contruct an error', () => {
      let error = new DuckExistsError();

      assert.equal((error instanceof DuckExistsError), true);
      assert.equal(error.name, 'DuckExistsError');
      assert.equal(error.message, 'Duck already exists');
    });

    test('should construct an error with a custom message', () => {
      let error = new DuckExistsError('custom error message');

      assert.equal(error.message, 'custom error message');
    });
  });
});