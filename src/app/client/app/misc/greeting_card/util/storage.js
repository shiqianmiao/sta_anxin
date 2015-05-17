var Storage = require('com/mobile/lib/storage/storage.js');
var storage = new Storage('greeting_card');

exports.get = function(key, callback) {
    callback(storage.get(key) || null);
};

exports.set = function(key, value, callback) {
    storage.set(key, value);
    setTimeout(function () {
        if (callback) {
            callback(value);
        }
    }, 0);
};

exports.clear = function () {
    storage.clear();
};