var EventEmitter = require('com/mobile/lib/event/event.js');
var $ = require('$');

var appCache = window.applicationCache;
var emitter = new EventEmitter();
// Fired after the first cache of the manifest.
appCache.addEventListener('cached', function () {
    emitter.emit('cached');
}, false);

// Checking for an update. Always the first event fired in the sequence.
appCache.addEventListener('checking', function () {
    emitter.emit('checking');
}, false);

// An update was found. The browser is fetching resources.
appCache.addEventListener('downloading', function () {
    emitter.emit('downloading');
}, false);

// The manifest returns 404 or 410, the download failed,
// or the manifest changed while the download was in progress.
appCache.addEventListener('error', function () {
    emitter.emit('error');
}, false);

// Fired after the first download of the manifest.
appCache.addEventListener('noupdate', function () {
    emitter.emit('noupdate');
}, false);

// Fired if the manifest file returns a 404 or 410.
// This results in the application cache being deleted.
appCache.addEventListener('obsolete', function () {
    emitter.emit('obsolete');
}, false);

// Fired for each resource listed in the manifest as it is being fetched.
appCache.addEventListener('progress', function () {
    emitter.emit('progress');
}, false);

// Fired when the manifest resources have been newly redownloaded.
appCache.addEventListener('updateready', function () {
    emitter.emit('updateready');
}, false);

exports.update = function (cb) {
    var defer = $.Deferred();

    defer
        .done(function (state) {
            cb(null, state);
        })
        .fail(function (err) {
            cb(err);
        });

    if (appCache.status === appCache.UNCACHED || appCache.status === appCache.IDLE) {
        defer.resolve();
        return;
    }

    if (appCache.status === appCache.UPDATEREADY) {
        appCache.swapCache();
        defer.resolve('updateready');
        return;
    }

    emitter
        .once('updateready', function () {
            try {
                appCache.swapCache();
            } catch (ex) {}
            defer.resolve('updateready');
        })
        .once('noupdate', function () {
            defer.resolve('noupdate');
        })
        .once('cached', function () {
            try {
                appCache.swapCache();
            } catch (ex) {}
            defer.resolve('cached');
        });

    if (appCache.status !== appCache.CHECKING && appCache.status !== appCache.DOWNLOADING) {
        appCache.update();
    }
};