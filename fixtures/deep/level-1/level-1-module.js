"use strict";

/**
 * The endpoint to be used.
 */
module.exports.level = "to-be-loaded";

module.exports.init = decorate;

/**
 * Decorates the server instance with a simple hello
 */
function decorate(server) {
  console.log("Ready to annotate with the " + module.exports.endpoint + " route");

  // Annotate the server with a GET endpoint
  // ATTENTION: YOU ARE REQUIRED TO CALL NEXT FOR RESTIFY TO CALL THE NEXT IN THE CHAIN!
  // https://gist.github.com/LeCoupa/0664e885fd74152d1f90#file-1-restify-server-cheatsheet-js-L131-L146
  server.get(module.exports.endpoint, function getHelloServerHandler(req, res, next) {

    res.header("Content-Type", module.exports.contentType);
    res.send("Hello... Be Intuitive!");

    next();
  });
}
