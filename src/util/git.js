/* eslint-disable no-restricted-syntax */
const simpleGit = require('simple-git');
const { promises: fs } = require('fs');

// Initialize git commands
const git = simpleGit();

const checkGit = async () => {
  // Get files in the directory
  const files = await fs.readdir(process.cwd());

  // Check if .git file is present
  for (const file of files) {
    if (file.includes('.git')) {
      return true;
    }
  }

  throw new Error(
    'No git repository found. Run linter in base directory of repository.'
  );
};

const getStaged = async () => {
  // Check git repository
  await checkGit();

  // Get latest status from Git
  const status = await git.status();

  // Get the created and staged files from status
  let files = status.created.concat(status.staged);

  // Check if any files are present
  if (files.length === 0) {
    throw new Error('No files available for staging');
  }

  // Filter the .js files
  files = files.filter(
    (file) => file.includes('.js') && !file.includes('.json')
  );

  return files;
};

const getModified = async () => {
  // Get latest status from Git
  const status = await git.status();

  const files = [];

  for (const file of status.files) {
    if (file.index === file.working_dir) {
      files.push(file.path);
    }
  }

  return files;
};

const stageModifiedFiles = async (files) => {
  // Get staged files from git
  const stagedFiles = await getModified();

  for (const file of stagedFiles) {
    // Check if file was originally staged in this commit
    if (files.includes(file)) {
      // Stage the file again to be a part of this commit
      git.add(file);
    }
  }
};

module.exports.getStaged = getStaged;
module.exports.stageModifiedFiles = stageModifiedFiles;
