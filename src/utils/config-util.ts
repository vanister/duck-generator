import * as path from 'path';
import * as fs from 'fs';

import { IOptions } from '../models/options.interface';

export function getConfig(baseOptions: IOptions) {
  if (!baseOptions || typeof baseOptions !== 'object' || Object.keys(baseOptions).length === 0) {
    throw new Error('baseOptions');
  }

  return function (workspaceRoot: string, configFile: string = 'ducks.config.js') {
    const fullpath = path.resolve(workspaceRoot, configFile);

    if (!fs.existsSync(fullpath)) {
      return baseOptions;
    }

    const config = require(fullpath);
    const merged = Object.assign({}, baseOptions, config);

    return merged;
  };
}
