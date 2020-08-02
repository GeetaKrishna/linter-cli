#!/usr/bin/env node

// Import required modules
const program = require("commander");
const chalk = require("chalk");
const git = require("./util/git");
const actions = require("./util/actions");

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
      const status = await git.getStatus;
      console.log(status);
    } catch (error) {
      console.log("exit process");
      process.exitCode = 2;
    }
  })();
});

// Handle --all option
program.on("option:all", () => {
  console.log("exit process");
  process.exitCode = 2;
});

program.parse(process.argv);
