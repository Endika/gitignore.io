'use strict';

/*
 * .gitIgnore File Walker and Data Builder
 */
var fs = require('fs');

var gitIgnores = {};
// var Datastore = function() {};

/*
 * Helper function to walk through the gitIgnore filesystem
 */
var walk = function(dir, filter, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) { return done(err); }
    var pending = list.length;
    if (!pending) { return done(null, results); }

    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, filter, function(err, res) {
            results = results.concat(res);
            if (!--pending) { done(null, results); }
          });

        } else {
          if (file.indexOf(filter) > -1) {
            // Strip off file name
            var fileName = file.split('/').pop();
            var name = fileName.split('.')[0];
            var contents = fs.readFileSync(file, 'utf8');
            gitIgnores[name.toLowerCase()] = {
              name: name,
              fileName: fileName,
              contents: contents
            };
          }

          if (!--pending) { done(null, results); }
        }
      });
    });
  });
};

// Build gitIgnore data set
var DatastoreModel = function() {
  var self = this;
  walk( __dirname + '/../data', '.gitignore', function(err, results) {
    if (err) { throw err; }
    var gitIgnoreJSON = [];
    var dropdownList = [];

    for (var key in gitIgnores) {
      gitIgnoreJSON.push(gitIgnores[key].name.toLowerCase());
      dropdownList.push({
        id: gitIgnores[key].name.toLowerCase(),
        text: gitIgnores[key].name
      });
    }

    self.dropdownList = dropdownList;
    self.JSONObject = gitIgnores;
    self.JSONString = gitIgnoreJSON.sort().join(',') + '\n';
    self.fileCount = gitIgnoreJSON.length;
  });
};

module.exports = new DatastoreModel();
