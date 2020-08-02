const chalk = require("chalk");

// Define help menus
const helpmenu = {
  help: `Usage: linter <options> 
  
  ${chalk.blueBright(
    "Welcome to @miracle/linter"
  )} : CLI tool for running eslint, prettier and airbnb based linter for Node JS projects

  Options 
    -help, -h ---------- Help Menu 
    -
  `,
};

const executeAction = async (command) => {
  switch (command) {
    case "help":
      return helpmenu.help.trim();

    default:
      throw Error("Error Case");
  }
};

module.exports = executeAction;
