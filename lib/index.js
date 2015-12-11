"use strict";

var fs = require("fs");
var path = require("path");

module.exports = loadModules;

/**
 * @param {String} dir is the full path to the directory to load.
 * @param {Object} filter is the filter with {filter.extension}.
 *
 * {
 *   filter.extension,
 *   filter.depth
 * }
 *
 * @return The list of files in a given directly without subdirectories.
 *
 * Note that module and error are multually exclusive.
 * [{
 *    filePath: The full path to the file,
 *    module: The loaded module.
 *    error: If an error occurs.
 * }]
 */
function loadModules(dir, filter) {
  var result = [];
  var files = [];
  var errors = [];
  try {
    files = fs.readdirSync(dir);

  } catch (directoryMightNotExistError) {
    // Don't do anything now.
  }
  files.forEach(function(file) {
    var currentPath = path.resolve(dir, file);
    if (!fs.statSync(currentPath).isDirectory()) {
      // Adding the file only if it passes the filter
      if ((filter && filter.extension && file.indexOf(filter.extension) >= 0) || !filter || !filter.extension) {
        try {
          var module = require(currentPath);
          result.push({filePath: currentPath, module: module});

        } catch (loadingException) {
          var error = new Error("Cannot load the module " + currentPath +  ": " + loadingException.message);
          error.stack = loadingException.stack;
          result.push({filePath: currentPath, error: error});
        }
      }

    } else if (filter.depth && --filter.depth >= 0) {
      // concat with the results from the directory
      result = result.concat(loadModules(currentPath, filter));
      ++filter.depth;
    }
  });
  return result;
}
