import { IOptions } from "./models/options.interface";

const options: IOptions = {
  ext: '.js',
  root: 'src/state/ducks',
  files: ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'],
  additionalFiles: []
};

/** The base options object for the extension */
export default options;
