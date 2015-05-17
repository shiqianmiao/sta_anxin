var $         = require('$');
var Util      = require('app/client/common/lib/util/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

var gjLog     = require('app/client/common/lib/log/log.js');
exports.bindJsA = function (config) {
    var config = config || {};
    var $el = config.$el || $('body');
    $el.on('click', '[data-js-a]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $cur = $(e.currentTarget);
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
    $el.on('click', '[data-native-a]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $cur = $(e.currentTarget);
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

exports.nativeA = function (config) {
    var config = config || {};
    var $el = config.$el || $('body');
    if (!NativeAPI.isSupport()) {
        return;
    }
    $el.on('click', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $cur = $(e.currentTarget);
        NativeAPI.invoke(
            'createWebView',
            {
                url: $cur.attr('href'),
                controls: $cur.data('controls')
            }
        );
    });
};
exports.transNativeA = function (config) {
    var config = config || {};
    var $el = config.$el || $('body');
    if (!NativeAPI.isSupport()) {
        return;
    }
    $el.on('click', 'a[data-role="item"]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $cur = $(e.currentTarget);
        var hasClick = false;
        if ($cur.hasClass('disabled')) {
            return;
        }
        if (hasClick) {
            return;
        }
        hasClick = true;
        NativeAPI.invoke(
            'createWebView',
            {
                url: $cur.attr('href'),
                controls: $cur.data('controls')
            },function () {
                hasClick = false;
            }
        );
    });
};
