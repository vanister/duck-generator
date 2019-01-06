import { DuckExistsError } from './duck-exists.error';

describe('Errors', () => {
  describe('DuckExistError', () => {
    it('should contruct an error', () => {
      let error = new DuckExistsError();

      expect(error).toBeInstanceOf(DuckExistsError);
      expect(error.name).toBe('DuckExistError');
      expect(error.message).toBe('Duck already exists');
    });

    it('should construct an error with a custom message', () => {
      let error = new DuckExistsError('custom error message');

      expect(error.message).toBe('custom error message');
    });
  });
});
