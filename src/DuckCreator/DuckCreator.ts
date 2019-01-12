import * as path from 'path';

import { exists, mkdir, writeFile } from '../utils/fs-async-utils';
import { IConfig } from '../models/config.interface';
import { DuckExistsError } from '../errors/duck-exists.error';

export class DuckCreator {
  constructor(
    private readonly workspaceRoot: string,
    private readonly config: IConfig
  ) { }

  async create(duck: string): Promise<void> {
    const absDuckPath = this.toAbsolutePath(duck);

    if (await exists(absDuckPath)) {
      const duck: string = path.basename(absDuckPath);

      throw new DuckExistsError(`'${duck}' already exists`);
    }

    if (this.config.createRoot) {
      await this.createRoot();
    }

    const { files, ext, additionalFiles } = this.config;
    const duckFiles = [
      ...files,
      ...additionalFiles
    ];

    // create the directory
    await mkdir(absDuckPath);

    const filePromises: Promise<any>[] = [];

    duckFiles.forEach((file: string) => {
      const filename = `${file}${ext}`;
      const fullpath = path.join(absDuckPath, filename);

      filePromises.push(writeFile(fullpath, `/* ${filename} */`));
    });

    await filePromises;
  }

  async createRoot(): Promise<void> {
    const ducksRoot = path.join(this.workspaceRoot, this.config.root);
    const rootExists = await exists(ducksRoot);

    if (rootExists) {
      return;
    }

    await mkdir(ducksRoot);
  }

  private toAbsolutePath(nameOrRelativePath: string): string {
    // simple test for slashes in string
    if (/\/|\\/.test(nameOrRelativePath)) {
      return path.join(this.workspaceRoot, nameOrRelativePath);
    }

    const { root } = this.config;

    // if it's just the name of the duck, assume that it'll be in
    return path.join(this.workspaceRoot, root, nameOrRelativePath);
  }
}
