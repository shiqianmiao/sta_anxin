var Storage = require('com/mobile/lib/storage/crossdomain_storage.js');
var UUID    = require('com/mobile/lib/uuid/uuid.js');
var Util    = require('app/client/common/lib/util/util.js');
var _       = require('underscore');

var storage = new Storage('hybrid-history');
var done    = module.async();
var windowName;

if (window.name) {
    windowName = window.name;
} else {
    windowName = UUID.generateUUIDV4();
    window.name = windowName;
}

storage.dump(function (err, data) {
    if (err) {
        throw err;
    }

    if (!data || !data.windows || !Array.isArray(data.windows.value)) {
        data = {};
        data.windows = {
            value: []
        };
    }

    Object.keys(data).forEach(function (key) {
        if (key === 'windows') {
            return;
        }

        if (data.windows.value.indexOf(key) === -1) {
            delete data[key];
        }
    });

    data.windows.value = _.without(data.windows.value, windowName);
    data.windows.value.unshift(windowName);
    data.windows.value = data.windows.value.slice(0, 20);

    storage.save(data, done);
});

exports.push = function (url, force, callback) {
    if (typeof force === 'function') {
        callback = force;
        force = false;
    }

    callback = callback || function (err) {
        if (err) {
            throw err;
        }
    };

    storage.get(windowName, function (err, stack) {
        if (err) {
            return callback(err);
        }

        stack = stack || [];

        if (stack[stack.length - 1] === url && !force) {
            return callback(null);
        }

        stack.push(url);

        storage.set(windowName, stack, callback);
    });
};

exports.getStack = function (callback) {
    storage.get(windowName, callback);
};

exports.back = function () {
    storage.get(windowName, function (err, stack) {
        var url;
        if (err) {
            throw err;
        }

        stack.pop();

        url = stack[stack.length - 1];

        if (!url) {
            throw new Error('History stack is empty');
        }

        storage.set(windowName, stack, function () {
            if (/^https?\/\//.test(url)) {
                window.location.href = url;
            } else {
                Util.redirect(url);
            }
        });
    });
};