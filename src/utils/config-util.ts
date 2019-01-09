import * as fs from 'fs';
import { IConfig } from '../models/config.interface';

export function getConfig(configPath: string, baseOptions: IConfig): IConfig {
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
  const merged = Object.assign({}, baseOptions, config) as IConfig;

  return merged;
}
