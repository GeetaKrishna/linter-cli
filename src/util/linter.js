const path = require('path');
const { ESLint } = require('eslint');
const ora = require('ora');
const actions = require('./actions');
const { promises: fs } = require('fs');

const runLinter = async (files, fix) => {
  try {
    // By default fix=false for linter
    let eslintOptions = { fix: false };

    // Check if fix option is needed
    if (fix == 'fix') {
      eslintOptions.fix = true;
    }

    // Create an instance of eslint with fix option
    const eslint = new ESLint(eslintOptions);

    // Run the linter against the files
    const results = await eslint.lintFiles(files);

    return { results, eslint };
  } catch (error) {
    throw error;
  }
};

const checkLintStatus = async (results) => {
  let status = true;

  // Iterate through array and check if errors occurred
  for (result of results) {
    if (
      result.errorCount > 0 ||
      result.warningCount > 0 ||
      result.fixableErrorCount > 0 ||
      result.fixableWarningCount > 0
    ) {
      status = false;
    }
  }

  return status;
};

const lintFilesAndCreateReport = async (files, fix) => {
  try {
    // Check for eslint config
    await actions.checkEslintConfig();

    // Get eslint results on files
    const { results, eslint } = await runLinter(files, fix);

    // Auto-Fix files where possible
    await ESLint.outputFixes(results);

    // Format the eslint output
    const formatter = await eslint.loadFormatter(
      path.join(
        __dirname,
        '../../node_modules/@miraclesoft/eslint-formatter-html/src/app.js'
      )
    );
    const resultText = formatter.format(results);

    const status = await checkLintStatus(results);

    return status;
  } catch (error) {
    throw error;
  }
};

module.exports = lintFilesAndCreateReport;
