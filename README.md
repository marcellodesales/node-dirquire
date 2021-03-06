# dirquire

[![Travis](https://api.travis-ci.org/marcellodesales/node-dirquire.svg)](https://travis-ci.org/marcellodesales/node-dirquire) [![npm version](https://badge.fury.io/js/dirquire.svg)](http://badge.fury.io/js/dirquire) [![Codacy Badge](https://api.codacy.com/project/badge/grade/161387c5f4714867acf2e3cc8fbe9ba6)](https://www.codacy.com/app/marcellodesales/node-dirquire) [![Code Climate](https://codeclimate.com/github/marcellodesales/node-dirquire/badges/gpa.svg)](https://codeclimate.com/github/marcellodesales/node-dirquire) [![Dependency Status](https://david-dm.org/marcellodesales/node-dirquire.svg)](https://david-dm.org/marcellodesales/node-dirquire) [![devDependency Status](https://david-dm.org/marcellodesales/node-dirquire/dev-status.svg)](https://david-dm.org/marcellodesales/node-dirquire#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/marcellodesales/node-dirquire/badge.svg?branch=master&service=github)](https://coveralls.io/github/marcellodesales/node-dirquire?branch=master) ![License](https://img.shields.io/badge/license-MIT-lightgray.svg)

[![NPM](https://nodei.co/npm/dirquire.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/dirquire/)

# Features

Helps loading multiple modules from a given directory, avoiding multiple manual
require statements in the module, allowing:

* *Interface-based loading*: Load multiple modules from a given directory;
* *Filtering*: Filtering which modules to load from a directory by file path;
* *API Result*: Properly return the response as an API.

# API

## require("dirquire")(dir, [filters]): array

* *dir*: a valid path to a directory according to `fs.statSync(path).isDirectory()`.
* *filters.extension*: optional parameter to filter file names.
* *filters.depth*: loads files in a given depth.

Loads all the files of a given

```js
  var loadedModules = require("dirquire")(dir, [filters]);
```

The result is an arry of the following api:

```js
  [{
    fileName: "The name of the file without the path.",
    filePath: "The full path to the loaded file.",
    module: "The instance of the loaded module. If an error occurs, it is undefined",
    error: "The instance of the Error captured while loading the module."
  }];
```

Take a look at the `fixtures` directory.

## Example: Load modules without errors

Using the node cli, you can run the following fixtures used by the test cases.

```js
$ node
> require("dirquire")("fixtures/all-modules-correct")
[ { fileName: 'hello.js',
    filePath: '/home/mdesales/dev/github/marcellodesales/node-dirquire/fixtures/all-modules-correct/hello.js',
    module: 
     { endpoint: '/hello',
       contentType: 'text/plain',
       init: [Function: decorate] } },
  { fileName: 'secure.js',
    filePath: '/home/mdesales/dev/github/marcellodesales/node-dirquire/fixtures/all-modules-correct/secure.js',
    module: 
     { endpoint: '/secure',
       contentType: 'text/plain',
       init: [Function: decorate] } } ]
```

## Example: Load modules with errors

* Files with syntax errors are not loaded.
* Files that requires a module that is not located in the `node_modules`.

```js
$ node
> require("dirquire")("fixtures/modules-with-error")
[ { fileName: 'illegal-token.js',
    filePath: '/home/mdesales/dev/github/marcellodesales/node-dirquire/fixtures/modules-with-error/illegal-token.js',
    error: [Error: Cannot load the module /home/mdesales/dev/github/marcellodesales/node-dirquire/fixtures/modules-with-error/illegal-token.js: Unexpected token ILLEGAL] },
  { fileName: 'module-requiring-non-existent-module.js',
    filePath: '/home/mdesales/dev/github/marcellodesales/node-dirquire/fixtures/modules-with-error/module-requiring-non-existent-module.js',
    error: [Error: Cannot load the module /home/mdesales/dev/github/marcellodesales/node-dirquire/fixtures/modules-with-error/module-requiring-non-existent-module.js: Cannot find module 'passport-restify'] } ]
```

# Use

## Simple Load

Loading multiple modules with a given interface, without requiring all the modules from the
given directory manually. Considering the routes directory containing `restify` or `express` routes:

```sh
$ tree my-app/routes/
my-app/routes/
├── hello.js
└── secure.js
```

Each route file implements the following interfaces: `endpoint`, `contentType`, and the function `init()`.

```js
"use strict";

// Loads ANY logger under APP_DIR/middleware/logger
var logger = require("middleware-js").instance().load("middleware/logger");

/**
 * The endpoint to be used.
 */
module.exports.endpoint = "/hello";
/**
 * The content type produced by this handler.
 */
module.exports.contentType = "text/plain";
/**
 * Decorates the server with a new route
 */
module.exports.init = decorate;

/**
 * Decorates the server instance with a simple hello
 */
function decorate(server) {
  logger.debug("Ready to annotate with the " + module.exports.endpoint + " route");

  // Annotate the server with a GET endpoint
  // ATTENTION: YOU ARE REQUIRED TO CALL NEXT FOR RESTIFY TO CALL THE NEXT IN THE CHAIN!
  // https://gist.github.com/LeCoupa/0664e885fd74152d1f90#file-1-restify-server-cheatsheet-js-L131-L146
  server.get(module.exports.endpoint, function getHelloServerHandler(req, res, next) {

    //console.log(logger === req.log); THIS IS TRUE. RESTIFY HAS AN INSTANCE OF THE LOGGER UNDER REQ
    req.log.debug("Finished fulfilling request for " + module.exports.endpoint);

    res.header("Content-Type", module.exports.contentType);
    res.send("Hello... Be Intuitive!");

    next();
  });
}
```

The following example loads all the routes with `dirquire`. 

* We can skip those routes that were not properly loaded;
* Continue loading those that were properly loaded without application disruption;
* Differently than other libraries such as `require-dir`, `dirquire` allows you to implement enterprise-gradle frameworks.

```js
  // Load the private routes not exposed
  var _this = this;
  var privateRoutes = [];

  var routes = require("dirquire")(__dirname + "/routes");
  routes.forEach(function(route) {
    if (route.error) { // problems loading the route does not prevent the application to be loaded.
      logger.error(route.error, "Error while loading the route");
      return; // continues the loop
    }

    logger.debug("Inializing route " + route.module.endpoint);

    // Call the route's "init" method... Note that the "module" is the reference of loaded module.
    route.module.init(_this.server);

    // Collecting the private routes$
    privateRoutes.push({
      endpoint: route.module.endpoint,
      contentType: route.module.contentType
    });
  });

  logger.info(privateRoutes, "Loaded private routes");
```

## Load with Filters and Directory Depth

Loading multiple modules with a given interface, without requiring all the modules from the
given directory manually. Considering the directory is as follows:

```sh
$ tree tasks
./tasks/
├── checkdeps
│   └── checkdeps_tasks.js
├── doc
│   └── doc_tasks.js
├── test
│   └── test_tasks.js
├── todo
│   ├── todo_tasks.js
│   └── xml-todos-serializer.js
└── versioning
    └── versioning_tasks.js
```

The following example loads all the `_tasks.js` files, but not the `xml-todos-serializer.js`. The `depth` filter helps navigating to directories that contains more than modules required to be loaded.

```js
  var loadModules = require("dirquire");

  // Load the private routes not exposed
  var filters = {
    extension: "*_task.js",
    depth: 1
  };

  // Setup each task
  var Tasks = dirquire(dir, filters);
  Tasks.forEach(function(Task) {
    // Report that the task was loaded...
    log.info("Verifying the task at " + Task.filePath);

    if (Task.error) {
      // Report the error for instance...
      log.error(Task.error.message);

    } else {
      // Execute the module
      new Task.module().setup();
    }
  });
```

The only observation is that all the returned objects must implement the same interface. In the case above,
all the tasks are classes with the method `setup()`. That is a good application of the `Visitor` and `Iterator` Design-Patterns. 

# Contributing

We use the GitFlow branching mechanics, http://nvie.com/posts/a-successful-git-branching-model/.

1. Fork it
2. Create your feature branch (`git checkout -b feature/issue-XYZ origin/master --track`)
 * Adding Ids helps communicating where this feature is coming from.
 * You can also solve any open Issue in the issues tab.
3. Commit your changes (`git commit -am 'Issue #XYZ: Add some feature to fix #444'`)
 * Adding "fix #444" will trigger a link to the GitHub issue #444.
4. Push to the branch (`git push feature/issue-XYZ`)
5. Create new Pull Request
