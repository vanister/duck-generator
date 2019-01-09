export interface IConfig {
  /** The file extension with a dot. I.E. '.js'. */
  ext: string;
  /** The root duck directory.  I.E. 'src/state/ducks'. */
  root: string;
  /** The files that make up a duck. */
  files: string[];
  /** Any additional files to create in addition to the duck `files`. */
  additionalFiles: string[];
  /** Set to true to have the root duck directory created, false otherwise.  Default: true. */
  createRoot: boolean;
}
