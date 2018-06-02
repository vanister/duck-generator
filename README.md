# Duck Generator

Utility to generate ducks for managing state in Redux using the [re-ducks](https://github.com/alexnm/re-ducks) pattern.

A duck contains the following files:
- `actions.js`
- `index.js`
- `operations.js`
- `reducers.js`
- `selectors.js`
- `tests.js`
- `types.js`
- `utils.js // will not be generated`

**NOTE 1: Assumes that duck will be generated in `./src/state/ducks` if a name is given. Example: `quack`, when entered into the prompt will create the duck at `./src/state/ducs/quack`.**

**NOTE 2: When specifying a path for the duck, the parent ducks folder must exist. Example: `src/state/ducklings/quack`, the folder `ducklings` must exist.**

## Usage

Open the command palette (macOS: `Shift+Command+P`, Windows: `Ctrl+Shift+P`) and type, "Generate Duck."

![Command Palette](images/command-palette.gif)

Type the name of the duck and hit enter.

![Some Duck](images/some-duck.gif)

Alternatively you can specify a relative path to a ducks folder that already exists.

![Some Duck Path](images/some-duck-path.gif)

## Known Issues

- Folder: `src/state/ducks` should exist or you will get an error. 
- Not tested on Windows.

## Source

[GitHub](https://github.com/vanister/duck-generator)

## License

[MIT](https://raw.githubusercontent.com/vanister/duck-generator/master/LICENSE)


