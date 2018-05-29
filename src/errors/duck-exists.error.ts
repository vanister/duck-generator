export class DuckExistsError extends Error {
  constructor(message: string = 'Duck already exists') {
    super(message);

    this.name = 'DuckExistsError';
  }
}