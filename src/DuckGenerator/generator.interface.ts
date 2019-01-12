import { IDisposable } from "./disposable.interface";

/** The Interface for a generator class */
export interface IGenerator extends IDisposable {
  /**
   * Executes the flow for generating a duck
   * @returns {Promise<void>} A promise when the execution is completed.
   */
  execute(): Promise<void>;
}