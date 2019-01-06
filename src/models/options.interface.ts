/** The overrides options object for the DuckGenerator */
export interface IOptionOverrides {
  /** The file extension with a dot. I.E. '.js' */
  ext?: string;
  root?: string;
  files?: string[];
  additionalFiles?: string[];
}

export interface IOptions {
  /** The file extension with a dot. I.E. '.js' */
  ext: string;
  root: string;
  files: string[];
  additionalFiles: string[];
}
