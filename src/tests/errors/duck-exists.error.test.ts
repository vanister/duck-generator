import { DuckExistError } from '../../errors/duck-exist.error';

describe('Errors', () => {
  describe('DuckExistError', () => {
    it('should contruct an error', () => {
      let error = new DuckExistError();

      expect(error).toBeInstanceOf(DuckExistError);
      expect(error.name).toBe('DuckExistError');
      expect(error.message).toBe('Duck already exists');
    });

    it('should construct an error with a custom message', () => {
      let error = new DuckExistError('custom error message');

      expect(error.message).toBe('custom error message');
    });
  });
});