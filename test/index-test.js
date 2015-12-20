"use strict";

var path = require("path");
var expect = require("chai").expect;

var dirquire = require("../lib");

describe("dirquire", function() {

  describe("Loading proper directory", function() {

    it("should load all modules in a dir and return the array", function(done) {

      // Use the fixture that's without problems
      var dir = path.resolve(__dirname, "fixture", "all-modules-correct");
      dirquire(dir).forEach(function modulesIterator(dirApi) {
        expect(dirApi.filePath).to.not.be.null;
        expect(dirApi.fileName).to.not.be.null;
        expect(dirApi.module).to.not.be.null;
      });

      done();

    });

  });

});
