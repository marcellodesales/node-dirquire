"use strict";

var path = require("path");
var expect = require("chai").expect;

var dirquire = require("../lib");

describe("dirquire", function() {

  describe("Loading proper directory with FILTER and DEPTH", function() {

    it("should load all modules filtering by extension and depth", function(done) {

      // Use the fixture that's without problems
      var dir = path.resolve("fixtures", "deep");
      var filter = { extension: "level", depth: 1};

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
