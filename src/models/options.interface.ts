/** The overrides options object for the DuckGenerator */
export interface IOptionOverrides {
  ext?: string;
  root?: string;
  files?: string[];
  additionalFiles?: string[];
}

export interface IOptions {
  ext: string;
  root: string;
  files: string[];
  additionalFiles: string[];
}
