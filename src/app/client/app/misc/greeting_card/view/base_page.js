var $         = require('$');
var Util      = require('app/client/common/lib/util/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

var gjLog     = require('app/client/common/lib/log/log.js');

exports.bindJsA = function (config) {
    var $el;
    config = config || {};
    $el = config.$el || $('body');

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
    $el.on('click', '[data-native-a]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $cur = $(e.currentTarget);
        NativeAPI.invoke(
            'createWebView',
            {
                url: $cur.data('native-a'),
                controls: $cur.data('controls')
            }
        );
    });
};