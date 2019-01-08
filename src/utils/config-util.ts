import * as fs from 'fs';
import { IOptions } from '../models/options.interface';

export function getConfig(configPath: string, baseOptions: IOptions): IOptions {
  if (!configPath) {
    throw new Error('configPath');
  }

  if (!baseOptions || typeof baseOptions !== 'object' || Object.keys(baseOptions).length === 0) {
    throw new Error('baseOptions');
  }

  if (!fs.existsSync(configPath)) {
    return baseOptions;
  }

  const config = require(configPath);
  const merged = Object.assign({}, baseOptions, config) as IOptions;

  return merged;
}
