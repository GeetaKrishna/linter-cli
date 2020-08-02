const path = require("path");
const { promises: fs } = require("fs");

const checkEslintConfig = async () => {
  // Get files in the directory
  const files = await fs.readdir(process.cwd());

  // Check if .eslint config file is present
  for (file of files) {
    if (file.includes(".eslint")) {
      return true;
    }
  }

  throw new Error("No eslint config found in current directory.");
};

const getFiles = async () => {
  // Get all the files from the directory recursively
  const results = await getFilesRecrusive(process.cwd(), []);

  let files = [];

  //Return array of file paths
  for (file of results) {
    files.push(`${file.path}/${file.name}`);
  }

  return files;
};

const getFilesRecrusive = async (path, files) => {
  // Initialize files variable if not already defined
  files = files || [];
  path = path || process.cwd();

  // Get all files from current directory
  try {
    // Get all files and directories from the current path
    const allFiles = await fs.readdir(path, { withFileTypes: true });

    // Remove all files that start with . and node_modules folder
    const folder = allFiles.filter((item) => {
      if (item.name.indexOf(".") == 0 || item.name === "node_modules") {
        return false;
      } else {
        return true;
      }
    });

    // Get all directores from the folder
    const directories = folder.filter((item) => item.isDirectory());

    // Get all files from the directory
    const currentDirFiles = folder.filter((item) => {
      if (
        !item.isDirectory() &&
        item.name.includes(".js") &&
        !item.name.includes(".json")
      ) {
        return true;
      } else {
        return false;
      }
    });

    // Add file path to the files
    currentDirFiles.forEach((file) => {
      file.path = path;
    });

    // Get all files from the folder and concat to files array
    files = files.concat(currentDirFiles);

    for (let i = 0; i < directories.length; i++) {
      // Get files from the directory
      const moreFiles = await getFilesRecrusive(
        `${path}/${directories[i].name}`,
        files
      );
      files = moreFiles;
    }
    return files;
  } catch (error) {
    throw error;
  }
};

module.exports.getFiles = getFiles;
