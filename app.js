#!/usr/bin/env node

// Import required modules
const program = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const git = require("./util/git");
const actions = require("./util/actions");
const linter = require("./util/linter");

const spinner = ora();

const description = `${chalk.blueBright(
  "Welcome to @miracle/linter"
)} : CLI tool for running eslint, prettier and airbnb based linter for Node JS projects`;

// Initialize program with the options
program
  .name("linter")
  .version("0.0.1", "-v, --version", "output the current version")
  .description(description)
  .action(() => {
    try {
      // Check if any other option was called
      if (program.staged || program.all) {
        //Do Nothing
      } else {
        const errorMessage = `Invalid usage of command, check ${chalk.yellow(
          "--help"
        )} for assistance.`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.log(`${chalk.red("Error")} : ${error.message}`);
      process.exitCode = 2;
    }
  })
  .option("-s, --staged [fix]", "run linter for staged files only")
  .option("-a, --all [fix]", "run linter on all files in the project");

// Handle --staged option
program.on("option:staged", () => {
  (async () => {
    try {
      // Start spinner
      spinner.color = "cyan";
      spinner.text = "Getting staged files for linting";
      spinner.start();

      // Get files that need to be linted
      const files = await git.getStaged();

      // Check if there are any files to be linted
      if (files.length !== 0) {
        // Update spinner
        spinner.color = "yellow";
        spinner.text = "Linting staged files";

        // Run eslint on all the files
        const status = await linter(files, program.staged);

        // Check if auto-fixed files need to be staged
        if (program.staged == "fix") {
          // Update spinner
          spinner.color = "red";
          spinner.text = "Adding files back to git";

          // Stage any of the modified files
          await git.stageModifiedFiles(files);
        }

        // Check if eslint status is false - false means errors are there in linting
        if (!status) {
          throw new Error(
            "Check errors in the /reports/lint.html file and fix before next commit."
          );
        }

        // Stop spinner
        spinner.stop();
      }
    } catch (error) {
      // Stop spinner
      spinner.stop();

      // Print error message
      console.log(`${chalk.red("Error")} : ${error.message}`);

      // Exit with non-zero status code
      process.exitCode = 2;
    }
  })();
});

// Handle --all option
program.on("option:all", () => {
  (async () => {
    try {
      // Start spinner
      spinner.color = "cyan";
      spinner.text = "Getting all files for linting";
      spinner.start();

      // Get all files in the directory
      const files = await actions.getFiles();

      // Check if there are any files to lint
      if (files.length !== 0) {
        // Update spinner
        spinner.color = "yellow";
        spinner.text = "Linting staged files";

        // Run eslint on all the files
        const status = await linter(files, program.all);

        // Check if eslint status is false - false means errors are there in linting
        if (!status) {
          throw new Error(
            "Check errors in the /reports/lint.html file and fix before next commit."
          );
        }

        // Stop spinner
        spinner.stop();

        console.log(result);
      }
    } catch (error) {
      // Stop spinner
      spinner.stop();

      // Print error message
      console.log(`${chalk.red("Error")} : ${error.message}`);

      // Exit with non-zero status code
      process.exitCode = 2;
    }
  })();
});

program.parse(process.argv);

// Check for invalid commands in program
try {
  if (program.staged && program.all) {
    const errorMessage = `Invalid usage of command, check ${chalk.yellow(
      "--help"
    )} for assistance.`;
    throw new Error(errorMessage);
  }
} catch (error) {
  console.log(`${chalk.red("Error")} : ${error.message}`);
  process.exit(2);
}
