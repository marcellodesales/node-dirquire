"use strict";

var fs = require("fs");

module.exports = loadModules;

/**
 * @param dir {string} is the full path to the directory to load.
 * @param filter {object} is the filter with {filter.extension}. 
 * @return The list of files in a given directly without subdirectories.
 */
function loadModules(dir, filter) {
  var result = [];
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
   var path = path.resolve(dir + "/" + file);
    if (!fs.statSync(path).isDirectory()) {

      // Adding the file only if it passes the filter
      if (filter && filter.extension && file.indexOf(filter.extension) > 0 || !filter || !filter.extension) {
        result.push(require(path));
      }

    } else {
      if (filter.depth && --filter.depth >= 0) {
        // concat with the results from the directory
        result = result.concat(loadModules(path, filter));
        ++filter.depth;
      }
    }
  });
  return result;
};
