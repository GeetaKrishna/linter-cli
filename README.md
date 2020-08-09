# @miraclesoft/linter

![version](https://img.shields.io/badge/dynamic/json?color=orange&label=version&prefix=%20&query=version&suffix=%20&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmiracleapps%2Flinter-cli%2Fmaster%2Fpackage.json) ![license](https://img.shields.io/badge/dynamic/json?color=blue&label=license&query=license&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmiracleapps%2Flinter-cli%2Fmaster%2Fpackage.json)

ESLint based Command Line Utility for usage within JavaScript based projects

**_Note_**_: This is a beta version of this formatter created for internal use by Miracle Apps, Miracle Software Systems, Inc.'s internal app development wing. Please submit any issues (or) feedback [here](https://github.com/miracleapps/linter-cli/issues)._

## Usage

Install as a dev-dependency with npm (or) yarn,

```sh
npm install @miraclesoft/linter --save-dev

(or)

yarn install @miraclesoft/linter --save-dev
```

You can then use the tool from the command line. Alternatively you can install the linter globally, but it is not advised at this point of time.

**_Note_** _: The linter cli will look for a eslint config file and if running with --staged option will look for a git repository to be initialized_

### Run with --staged

Running with --staged will only run the linter on .js files that are staged for a git commit.

```sh
./node_modules/.bin/linter --staged

When run with --staged all auto-fixed files will be re-staged by git as well

./node_modules/.bin/linter --staged fix

Adding the fix option in the command will use eslint with auto-fix mode
```

### Run with --all

Running with --all will run the linter on all .js files in the project.

```sh
./node_modules/.bin/linter --all

./node_modules/.bin/linter --all fix

Adding the fix option in the command will use eslint with auto-fix mode
```

### Usage with Husky

If you are using Husky in your projects for pre-commit git hooks, then you can use this linter as a single command in your configuration.

```json
"husky": {
    "hooks": {
      "pre-commit": "./node_modules/.bin/linter --staged fix"
    }
  }
```

## Lint Report

When run, the formatter will output a HTML report in **/reports/lint-report.html**

Here is a preview for the [HTML Report](http://htmlpreview.github.io/?https://github.com/miracleapps/eslint-formatter-html/blob/master/assets/lint-report.html)

The report is generated using the **@miraclesoft/eslint-formatter-html** custom formatter - [read more](https://www.npmjs.com/package/@miraclesoft/eslint-formatter-html).

## Contributors

- **Chanakya Lokam** - Director Innovation | Miracle Software Systems, Inc.
- **Geetha Krishan Adhikari** - Sr. Full Stack Engineer | Miracle Software Systems, Inc.

## License

© 2020 Miracle Software Systems, Inc.

Licensed under the [MIT License](LICENSE).
