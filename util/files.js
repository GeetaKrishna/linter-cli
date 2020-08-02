const path = require("path");
const fs = require("fs");

const getFiles = async () => {
  // Get all files from current directory
  fs.readdir(process.cwd(), (error, files) => {
    if (error) {
      throw error;
    } else {
      console.log(files);
      return files;
    }
  });
};

module.exports = getFiles;
