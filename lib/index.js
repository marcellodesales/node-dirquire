"use strict"; /* jscs: disable */

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
 * Note that module and error are multually exclusive.
 * [{
 *    filePath: The full path to the file,
 *    module: The loaded module.
 *    error: If an error occurs.
 * }]
 */
function requireDir(dir, filter) {
  var result = [];

  // May throw errors depending if the file exists or if no permissions
  fs.readdirSync(path.resolve(dir)).forEach(function(file) {

    // The current path.
    var currentPath = path.resolve(dir, file);

    if (!fs.statSync(currentPath).isDirectory()) {

      // process the file
      var moduleApi = processFile(file, currentPath, filter);

      // if the filters and filters applied
      if (moduleApi) {
        result.push(moduleApi);
      }

    } else if (filter.depth && --filter.depth >= 0) {
      // concat with the results from the directory
      result = result.concat(requireDir(currentPath, filter));
      ++filter.depth;
    }

  });
  return result;
}

/**
 * Process the file, applying filter.
 *
 * @param {string} file is the name of the file and extension. For instance, a.js or b.json
 * @param {string} filePath is the full path to the file.
 * @param {Object} filter is the filter to verify if the file is to be added or not.
 */
function processFile(file, filePath, filter) {

  // possible response, if the filter is undedined or not applicable
  var resultApi = {
    fileName: file,
    filePath: filePath
  };

  // Adding the file only if it passes the filter
  if (!filter || !filter.extension || (filter && filter.extension && file.indexOf(filter.extension) >= 0)) {
    try {
      resultApi.module = require(filePath);

    } catch (loadingException) {
      var error = new Error("Cannot load the module " + filePath +  ": " + loadingException.message);
      error.stack = loadingException.stack;
      resultApi.error = error;
    }

    // Return the api about the file.
    return resultApi;
  }
}
