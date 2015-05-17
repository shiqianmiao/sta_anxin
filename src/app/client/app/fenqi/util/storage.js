var Storage = require('com/mobile/lib/storage/storage.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var storage = new Storage('_credite_shop');

exports.get = function(key, callback) {
    NativeAPI.invoke('storage', {
        action: 'get',
        key: key
    }, function (err, data) {
        if (err && err.code === -32601) {

            setTimeout(function () {
                callback(storage.get(key) || null);
            }, 300);
        } else {

            if (!data) {
                data = {};
            }

            callback(JSON.parse(data.value || null));
        }
    });
};

exports.set = function(key, value, callback) {
    NativeAPI.invoke('storage', {
        action: 'set',
        key: key,
        value: typeof value === 'string' ? value : JSON.stringify(value)
    }, function (err, data) {
        if (err && err.code === -32601) {
            storage.set(key, value);

            setTimeout(function () {
                callback && callback(value);
            }, 0);
        } else {
            callback && callback(data ? data.value : '');
        }
    });
};