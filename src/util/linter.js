const path = require('path');
const { ESLint } = require('eslint');
const actions = require('./actions');

const runLinter = async (files, fix) => {
  // By default fix=false for linter
  const eslintOptions = { fix: false };

  // Check if fix option is needed
  if (fix === 'fix') {
    eslintOptions.fix = true;
  }

  // Create an instance of eslint with fix option
  const eslint = new ESLint(eslintOptions);

  // Run the linter against the files
  const results = await eslint.lintFiles(files);

  return { results, eslint };
};

const checkLintStatus = async (results) => {
  let status = true;

  // Iterate through array and check if errors occurred
  // eslint-disable-next-line no-restricted-syntax
  for (const result of results) {
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
  // Check for eslint config
  await actions.checkEslintConfig();

  // Get eslint results on files
  const { results, eslint } = await runLinter(files, fix);

  // Auto-Fix files where possible
  await ESLint.outputFixes(results);

  // Format the eslint output
  const formatter = await eslint.loadFormatter('@miraclesoft/html');

  // eslint-disable-next-line no-unused-vars
  const resultText = formatter.format(results);

  const status = await checkLintStatus(results);

  return status;
};

module.exports = lintFilesAndCreateReport;
