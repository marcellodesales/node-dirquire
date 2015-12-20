"use strict";

/**
 * The endpoint to be used.
 */
module.exports.endpoint = "/secure";
/**
 * The content type produced by this handler.
 */
module.exports.contentType = "text/plain";
/**
 * Decorate the server with the route info
 */
module.exports.init = decorate;

/**
 * Decorates the server instance with the secure
 */
function decorate(server) {
  logger.debug("Ready to decorate server with the " + module.exports.endpoint + " route");

  server.get(module.exports.endpoint,

    //and if it passes security, serve something considered secure.
    // ATTENTION: YOU ARE REQUIRED TO CALL NEXT FOR RESTIFY TO CALL THE NEXT IN THE CHAIN!
    // https://gist.github.com/LeCoupa/0664e885fd74152d1f90#file-1-restify-server-cheatsheet-js-L131-L146
    function getSecureServerHandler(req, res, next) {
      console.log("Finished fulfilling request for " + module.exports.endpoint);

      res.header("Content-Type", module.exports.contentType);
      res.send("Authorized (:");

      next();
    });
}
