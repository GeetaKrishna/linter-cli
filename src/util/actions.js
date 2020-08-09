/* eslint-disable no-restricted-syntax */
const { promises: fs } = require('fs');

const checkEslintConfig = async () => {
  // Get files in the directory
  const files = await fs.readdir(process.cwd());

  // Check if .eslint config file is present
  for (const file of files) {
    if (file.includes('.eslint')) {
      return true;
    }
  }

  throw new Error('No eslint config found in current directory.');
};

const getFilesRecrusive = async (inputPath, inputFiles) => {
  // Initialize files variable if not already defined
  let files = inputFiles || [];
  const path = inputPath || process.cwd();

  // Get all files and directories from the current path
  const allFiles = await fs.readdir(path, { withFileTypes: true });

  // Remove all files that start with . and node_modules folder
  const folder = allFiles.filter((item) => {
    if (item.name.indexOf('.') === 0 || item.name === 'node_modules') {
      return false;
    }
    return true;
  });

  // Get all directores from the folder
  const directories = folder.filter((item) => item.isDirectory());

  // Get all files from the directory
  const currentDirFiles = folder.filter((item) => {
    if (
      !item.isDirectory() &&
      item.name.includes('.js') &&
      !item.name.includes('.json')
    ) {
      return true;
    }
    return false;
  });

  // Add file path to the files
  currentDirFiles.forEach((file) => {
    // eslint-disable-next-line no-param-reassign
    file.path = path;
  });

  // Get all files from the folder and concat to files array
  files = files.concat(currentDirFiles);

  for (let i = 0; i < directories.length; i += 1) {
    // Get files from the directory
    // eslint-disable-next-line no-await-in-loop
    const moreFiles = await getFilesRecrusive(
      `${path}/${directories[i].name}`,
      files
    );
    files = moreFiles;
  }
  return files;
};

const getFiles = async () => {
  // Get all the files from the directory recursively
  const results = await getFilesRecrusive(process.cwd(), []);

  // Check if there are any resulting files for linting
  if (results.length !== 0) {
    const files = [];

    // Return array of file paths
    for (const file of results) {
      files.push(`${file.path}/${file.name}`);
    }

    return files;
  }
  // Return empty array if there are no files to lint
  return [];
};

module.exports.getFiles = getFiles;
module.exports.checkEslintConfig = checkEslintConfig;
