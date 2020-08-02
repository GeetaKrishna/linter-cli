#!/usr/bin/env node

// Import required modules
const program = require("commander");
const chalk = require("chalk");
const git = require("./util/git");
const actions = require("./util/actions");
const linter = require("./util/linter");

const description = `${chalk.blueBright(
  "Welcome to @miracle/linter"
)} : CLI tool for running eslint, prettier and airbnb based linter for Node JS projects`;

// Initialize program with the options
program
  .name("linter")
  .version("0.0.1", "-v, --version", "output the current version")
  .description(description)
  .option("-s, --staged", "run linter for staged files only")
  .option("-a, --all", "run linter on all files in the project");

// Handle --staged option
program.on("option:staged", () => {
  (async () => {
    try {
      // Get files that need to be linted
      const files = await git.getStaged();
      const result = await linter(files);

      // Run eslint on all the files
      console.log(result);
    } catch (error) {
      console.log(error.message);
      process.exitCode = 2;
    }
  })();
});

// Handle --all option
program.on("option:all", () => {
  (async () => {
    try {
      // Get all files in the directory
      const files = await actions.getFiles();
      const result = await linter(files);

      // Run eslint on all the files
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  })();
});

program.parse(process.argv);
