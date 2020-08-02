const { ESLint } = require("eslint");
const ora = require("ora");

const lintFiles = async (files) => {
  try {
    // Create an instance of eslint with fix option
    const eslint = new ESLint({ fix: true });

    // Run the linter against the files
    const results = await eslint.lintFiles(files);

    return { results, eslint };
  } catch (error) {
    throw error;
  }
};

const modifyFiles = async (results) => {};

const lintFilesAndCreateReport = async (files) => {
  try {
    // Start spinner
    const spinner = ora("Linting your project").start();

    // Get eslint results on files
    const { results, eslint } = await lintFiles(files);

    // Auto-Fix files where possible
    await ESLint.outputFixes(results);

    // Format the eslint output
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);
    spinner.stop();
    return resultText;
  } catch (error) {
    throw error;
  }
};

module.exports = lintFilesAndCreateReport;
