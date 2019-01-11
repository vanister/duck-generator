import * as fs from 'fs';
import * as util from 'util';

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

export {
  exists,
  mkdir
};
