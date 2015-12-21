"use strict";

var path = require("path");
var expect = require("chai").expect;

var dirquire = require("../lib");

describe("dirquire", function() {

  describe("Modules with errors", function() {

    it("should NOT load modules and return error in the elements", function(done) {

      // Use the fixture that's without problems
      var dir = path.resolve("fixtures", "modules-with-error");
      dirquire(dir).forEach(function modulesIterator(dirApi) {
        expect(dirApi.filePath).to.not.be.null;
        expect(dirApi.fileName).to.not.be.null;
        expect(dirApi.error).to.be.an("Error");

        console.log(dirApi);

        // the module should not be defined
        expect(dirApi.module).to.be.undefined;
      });

      done();

    });

  });

});
