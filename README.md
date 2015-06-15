dirquire
=====================

![Built With](http://img.shields.io/badge/built_with-Gulp-brightgreen.svg)

Features
======

Helps loading multiple modules from a given directory, avoiding multiple manual
require statements in the module, allowing:

* *Interface-based loading*: Load multiple modules from a given directory;
* *Filtering*: Filtering which modules to load from a directory by file path;
* *API Result*: Properly return the response as an API.

API
====

```js
  var loadedModules = [{
    filePath: "The full path to the loaded file.",
    module: "The instance of the loaded module. If an error occurs, it is undefined",
    error: "The instance of the Error captured while loading the module."
  }];
```

* Use the `filePath` to refer to the file loaded.
* When defined, the `module` is what was loaded.
* Re-throw the `error` if you need to report the errors of the collection.

Use
======

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

The following example loads all the `_tasks.js` files, but not the `xml-todos-serializer.js`.

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
    // Verifying the module
    console.log("Verifying the task at " + Task.filePath);

    if (Task.error) {
      // Report the error for instance
      console.log("ERROR: " + Task.error.message);

    } else {
      // Execute the module
      new Task.module().setup();
    }
  });
```

The only observation is that all the returned objects must implement the same interface. In the case above,
all the tasks are classes with the method `setup()`.

Contributing
========

We use the GitFlow branching mechanics, http://nvie.com/posts/a-successful-git-branching-model/.

1. Fork it
2. Create your feature branch (`git checkout -b feature/issue-XYZ origin/master --track`)
 * Adding Ids helps communicating where this feature is coming from.
 * You can also solve any open Issue in the issues tab.
3. Commit your changes (`git commit -am 'Issue #XYZ: Add some feature to fix #444'`)
 * Adding "fix #444" will trigger a link to the GitHub issue #444.
4. Push to the branch (`git push feature/issue-XYZ`)
5. Create new Pull Request
