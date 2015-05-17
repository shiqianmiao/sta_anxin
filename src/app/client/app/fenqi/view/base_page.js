var $         = require('$');
var Util      = require('app/client/common/lib/util/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var HybridAPI = require('app/client/common/lib/api/index.js');

var gjLog     = require('app/client/common/lib/log/log.js');

exports.bindJsA = function (config) {
    var config = config || {};
    var $el = config.$el || $('body');
    $el.on('click', '[data-js-a]', function (e) {
        var $cur = $(e.currentTarget);

        e.preventDefault();
        e.stopPropagation();

        Util.redirect($cur.data('js-a'));
    });
};
exports.setGjch = function (str) {
    gjLog.setGjch(str);
};
exports.log = function (str) {
    gjLog.send(str);
};
exports.bindNativeA = function (config) {
    var config = config || {};
    var $el = config.$el || $('body');
    if (!NativeAPI.isSupport()) {
        return false;
    }
    $el.on('click', '[data-native-a]', function (e) {
        var $cur = $(e.currentTarget);

        e.preventDefault();
        e.stopPropagation();

        if ($cur.data('evlog')) {
            gjLog.send($cur.data('evlog'));
        }
        NativeAPI.invoke(
            'createWebView',
            {
                url: window.location.pathname + $cur.data('native-a'),
                controls: $cur.data('controls')
            }
        );
    });
};
exports.user = {
    login: function () {
        var userDefer = $.Deferred();
        if (!NativeAPI.isSupport()) {
            this.wapLogin();
        }
        NativeAPI.invoke('login', null, function (err, userInfo) {
            if (err) {
                userDefer.reject(err);
            } else {
                userDefer.resolve(userInfo);
            }
        });
        return userDefer;
    },
    getUserInfo: function (callback) {
        var defer = $.Deferred();
        HybridAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (err) {
                defer.reject(err);
                return;
            }
            defer.resolve(userInfo);
        });
        if (callback) {
            defer
                .done(function (userInfo) {
                    callback(null, userInfo);
                })
                .fail(function (err) {
                    callback(err);
                });
        }
        return defer.promise();
    },
    tryLogin: function () {
        var defer = $.Deferred();
        var self  = this;
        this.getUserInfo()
            .done(function (userInfo) {
                defer.resolve(userInfo);
            }).fail(function () {
                self.login()
                .done(function (userInfo) {
                    defer.resolve(userInfo);
                })
                .fail(function (err) {
                    defer.reject(err);
                });
            });
        return defer;
    },
    wapLogin: function () {
        var back_url = window.location.hash.replace(/^#/, '');
        Util.redirect('app/client/common/view/account/login.js?back_url=' + encodeURIComponent(back_url));
    }
};