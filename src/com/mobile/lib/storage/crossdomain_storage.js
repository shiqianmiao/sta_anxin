var $ = require('$');
var defer = $.Deferred();
var done = module.async();

(function (callback) {
    if (window.location.host !== 'sta.ganji.com') {
        require.async('com/mobile/lib/crossdomain_rpc/index.js', function (RPC) {
            RPC.init('com/mobile/lib/storage/storage_rpc.js', callback);
        });
    } else {
        require.async('com/mobile/lib/storage/storage_rpc.js', function (rpc) {
            rpc.send = function (message) {
                rpc.onMessage(message);
            };
            rpc.ready();

            callback(null, rpc);
        })
            .fail(function () {
                callback(new Error('storage rpc load fail'));
            });
    }
})(function (err, rpc) {
    if (err) {
        defer.reject(err);
    } else {
        defer.resolve(rpc);
    }

    done();
});

function rpc(method, params, callback) {
    defer
        .fail(function (err) {
            callback(err);
        })
        .done(function (rpc) {
            rpc.invoke(method, params, callback);
        });
}

function Storage (namespace) {
    this.namespace = namespace;
}

module.exports = Storage;

Storage.prototype.set = function (key, value, callback) {
    rpc('set', {
        key: key,
        value: value,
        namespace: this.namespace
    }, callback);
};

Storage.prototype.get = function (key, callback) {
    rpc('get', {
        namespace: this.namespace,
        key: key
    }, callback);
};

Storage.prototype.remove = function (key, callback) {
    rpc('remove', {
        namespace: this.namespace,
        key: key
    }, callback);
};

Storage.prototype.dump = function (callback) {
    rpc('dump', {
        namespace: this.namespace
    }, callback);
};

Storage.prototype.save = function (data, callback) {
    rpc('save', {
        namespace: this.namespace,
        data: data
    }, callback);
};

Storage.prototype.clear = function (callback) {
    rpc('clear', {
        namespace: this.namespace
    }, callback);
};
