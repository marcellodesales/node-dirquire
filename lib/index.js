"use strict";

var fs = require("fs");
var path = require("path");

module.exports = requireDir;

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
 * @throw Error from fs.readdirSync: when the dir does not exist or there's no permission.
 *
 * Note that module and error are multually exclusive.
 * [{
 *    filePath: The full path to the file,
 *    module: The loaded module.
 *    error: If an error occurs.
 * }]
 */
function requireDir(dir, filter) {
  var result = [];
  var files = [];
  var errors = [];
  files = fs.readdirSync(path.resolve(dir));
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
      result = result.concat(requireDir(currentPath, filter));
      ++filter.depth;
    }
  });
  return result;
}
