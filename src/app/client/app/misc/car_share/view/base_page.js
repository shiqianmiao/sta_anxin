var $         = require('$');
var Util      = require('app/client/common/lib/util/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var gjLog     = require('app/client/common/lib/log/log.js');

exports.bindJsA = function (config) {
    config = config || {};
    var $el = config.$el || $('body');
    $el.on('click', '[data-js-a]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $cur = $(e.currentTarget);
        Util.redirect($cur.data('js-a'));
    });
};
exports.bindNativeA = function (config) {
    config = config || {};
    var $el = config.$el || $('body');
    $el.on('click', '[data-native-a]', function (e) {
        if(NativeAPI.isSupport()){
            e.preventDefault();
            e.stopPropagation();
            var $cur = $(e.currentTarget);
            if ($cur.data('evlog')) {
                gjLog.send($cur.data('evlog'));
            }
            NativeAPI.invoke(
                'createWebView',
                {
                    url: $cur.attr('href'),
                    controls: $cur.data('controls')
                }
            );
        }
    });
};