var $ = require('$');

/**
 * @example:
 *
 * Util.promisify(function (args, callback) {
 *     if (hasError()) {
 *         return callback(getError());
 *     } else {
 *         return callback(null, getResult());
 *     }
 * });
 */
exports.promisify = function (fn) {
    return function () {
        var args = [].slice.call(arguments);
        var cb = args[args.length - 1];
        var defer = $.Deferred();

        if (typeof cb === 'function') {
            args = args.slice(0, -1);
        } else {
            cb = null;
        }

        fn.apply(null, args.concat(function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        }));

        if (cb) {
            defer
                .done(function (result) {
                    cb(null, result);
                })
                .fail(function (err) {
                    cb(err);
                });
        }

        return defer.promise();
    };
};

/**
 * @example:
 *
 * async.series([
 *     callbackify(getPromiseOne(args)),
 *     callbackify(getPromiseTwo()),
 *     ...
 * ], handleResult);
 */

exports.callbackify = function (fn) {
    return function (cb) {
        var promise = fn();
        promise.then(function (result) {
            cb(null, result);
        }, cb);
    };
};

/* jshint ignore: start */
exports.generateUUIDV4 = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c == 'x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};
/* jshint ignore: end */

exports.toast = (function () {
    var $tip = $('<div class="toast"></div>').hide().appendTo('body');
    var hideTipTimer;
    return function (message, timeout) {
        timeout = timeout || 3000;
        if (message) {
            $tip.html('<span>' + message + '</span>').show();
        }

        if (timeout) {
            clearTimeout(hideTipTimer);
            hideTipTimer = setTimeout(function () {
                $tip.hide();
            }, timeout);
        }

        $('body').append($tip);

        return {
            setMessage: function (message, timeout) {
                $tip.html('<span>' + message + '</span>');
                if (timeout) {
                    clearTimeout(hideTipTimer);
                    hideTipTimer = setTimeout(function () {
                        $tip.remove();
                    }, timeout);
                }
            },
            remove: function () {
                $tip.remove();
            }
        };
    };
})();

exports.redirect = function (view) {
    var query = window.location.search;
    if (!query) {
        query = '?redirect=true';
    } else if (query.indexOf('redirect=true') === -1) {
        query += '&redirect=true';
    } else {
        query = query.replace(/&?redirect=true/, '');
    }
    if (query === '?') {
        query = '';
    }

    window.location.href = window.location.pathname + query + '#' + view;
};