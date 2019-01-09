import { IConfig } from "./models/config.interface";

const config: IConfig = {
  ext: '.js',
  root: 'src/state/ducks',
  files: ['operators', 'selectors', 'actions', 'reducers', 'types', 'test', 'index'],
  additionalFiles: [],
  createRoot: true
};

/** The base options object for the extension */
export default config;
