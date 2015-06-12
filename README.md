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

Use
======

Loading multiple modules with a given interface, without requiring all the modules from the
given directory manually. Considering the directory is as follows:

```
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
    new Task().setup();
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
