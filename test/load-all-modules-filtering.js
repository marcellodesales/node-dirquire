"use strict";

var path = require("path");
var expect = require("chai").expect;

var dirquire = require("../lib");

describe("dirquire", function() {

  describe("Loading proper directory with FILTER", function() {

    it("should load all modules WITH FILTER in a dir and return the array", function(done) {

      // Use the fixture that's without problems
      var dir = path.resolve("fixtures", "all-modules-correct");
      var filter = { extension: "cure"};

      // Only one file is loaded, the secure.js
      var modules = dirquire(dir, filter);

      console.log(modules);

      expect(modules.length).to.equal(1);

      modules.forEach(function modulesIterator(dirApi) {
        expect(dirApi.filePath).to.not.be.null;
        expect(dirApi.fileName).to.not.be.null;
        expect(dirApi.module).to.not.be.null;
      });

      done();

    });

  });

});
