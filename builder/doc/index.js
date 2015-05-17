var mkdirp = require('mkdirp');
var path = require('path');
var markdox = require('./markdox');

module.exports = function (file, callback) {
    var config = this.config;
    var docPath = config.docs + file.id;

    mkdirp(path.dirname(docPath), function (err) {
        if (err) {
            return callback(new Error('Fail to mkdir: ' + path.dirname(docPath)));
        }

        var options = {
            output: docPath + '.md',
            id: file.id
        };

        markdox.process(config.src + file.id, options, function(err) {
            if (err) {
                throw err;
            }
        });
    });

    callback(null);
};