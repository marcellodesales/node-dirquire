"use strict";

var passport = require("passport-restify");

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
 * Decorates the server instance with the secure route with EIAM.
 */
function decorate(server) {
  console.log("Ready to decorate server with the " + module.exports.endpoint + " route");
}
