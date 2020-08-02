const minimist = require("minimist");
const chalk = require("chalk");

// Define error messages
const messages = {
  noCommands: `${chalk.blueBright(
    "@miracle/linter"
  )} : No valid commands found for linter to use. See ${chalk.yellow(
    "linter --help"
  )} for help.`,
  tooManyCommands: `${chalk.blueBright(
    "@miracle/linter"
  )} : Invalid usage of linter commands. See ${chalk.yellow(
    "linter --help"
  )} for help.`,
};

// Parse commands from the arguments object
const getCommand = async (args) => {
  // Get length of arguments object
  const argLength = Object.keys(args).length;
  console.log(args);

  // Determine command to be used from command line
  if (argLength == 1) {
    throw Error(messages.noCommands);
  } else if (argLength > 2) {
    throw Error(messages.tooManyCommands);
  } else {
    let command = "";
    console.log(args);
    // Check for Help Command
    if (args.hasOwnProperty("help") || args.hasOwnProperty("h")) {
      command = "help";
      return command;
    }
    // Check for Version Command)
    if (args.version || args.v) {
      command = "version";
      return command;
    }

    // Check for Staged Command
    if (args.staged || args.s) {
      command = "staged";
      return command;
    }

    // Check for All Command
    if (args.all || args.a) {
      command = "all";
      return command;
    }

    console.log(command);
  }
};

const getArgs = async () => {
  // Get arguments from the process
  var args = minimist(process.argv.slice(2));

  // Parse the command from the arguments object
  try {
    const command = await getCommand(args);
    return command;
  } catch (error) {
    throw error;
  }
};

module.exports = getArgs;
