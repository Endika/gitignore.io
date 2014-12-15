'use strict';


var DatastoreModel = require('../../models/datastore');

module.exports = function (router) {
/*
 * GET List of all ignore types
 */
    router.get('/list', function (req, res) {
      res.setHeader('Cache-Control', 'public, max-age=0');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Expires', new Date(Date.now()).toUTCString());
      res.send(DatastoreModel.JSONString);
    });
/*
 * GET API page.
 */
    router.get('/(:ignore)', function (req, res) {
      var ignoreFileList = req.params.ignore.toLowerCase().split(',');
      var output = generateFile(ignoreFileList);
      res.setHeader('Cache-Control', 'public, max-age=0');
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Expires', new Date(Date.now()).toUTCString());
      res.send(output);
    });
/*
 * POST API File
 */
    router.get('/f/(:ignore)', function (req, res) {
      var ignoreFileList = req.params.ignore.split(',');
      var output = generateFile(ignoreFileList);
      res.setHeader('Cache-Control', 'public, max-age=0');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Expires', new Date(Date.now()).toUTCString());
      res.setHeader('Content-Disposition', 'attachment; filename=".gitignore"');
      res.send(output);
    });

/*
 * GET CLI Help.
 */
    router.get('/*', function (req, res) {
      res.setHeader('Cache-Control', 'public, max-age=0');
      res.setHeader('Expires', new Date(Date.now()).toUTCString());
      res.send('gitignore.io help:\n  list    - lists the operating systems, programming languages and IDE input types\n  :types: - creates .gitignore files for types of operating systems, programming languages or IDEs\n');

    });
};

/*
 * Helper for generating concatenated gitignore templates
 */
function generateFile(list){
  var output = '# Created by https://www.gitignore.io\n';
  for (var file in list) {
    if (DatastoreModel.JSONObject[list[file]] === undefined){
      output += '\n#!! ERROR: ' + list[file] + ' is undefined. Use list command to see defined gitignore types !!#\n';
    } else {
      output += '\n### ' + DatastoreModel.JSONObject[list[file]].name + ' ###\n';
      output += DatastoreModel.JSONObject[list[file]].contents + '\n';
    }
  }
  return output;
}
