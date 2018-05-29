import { DuckExistsError } from '../../errors/duck-exists.error';

describe('Errors', () => {
  describe('DuckExistsError', () => {
    it('should contruct an error', () => {
      let error = new DuckExistsError();

      expect(error).toBeInstanceOf(DuckExistsError);
      expect(error.name).toBe('DuckExistsError');
      expect(error.message).toBe('Duck already exists');
    });

    it('should construct an error with a custom message', () => {
      let error = new DuckExistsError('custom error message');

      expect(error).toBeInstanceOf(DuckExistsError);
      expect(error.message).toBe('custom error message');
    });
  });
});