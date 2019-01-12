import * as fs from 'fs';
import * as util from 'util';

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

export {
  exists,
  mkdir,
  writeFile
};
