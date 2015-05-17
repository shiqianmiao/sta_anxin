var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var BasePage    = require('app/client/app/fenqi/view/base_page.js');
var Util        = require('app/client/common/lib/util/util.js');

var tpl         = require('app/client/app/fenqi/template/index_page.tpl');
require('../style/style.css');

var $body       = $('body');
/*
    ## status

    var $body = $('body');
    $body.removeClass('loading');
    $body.addClass('offline');
    $body.addClass('nothing');
*/
var User = BasePage.user;

exports.init = function () {
    $body.removeClass('loading');
    NativeAPI.invoke('updateTitle', {'text': '分期'} );
    $body.append(tpl());
    BasePage.bindNativeA();
    Widget.initWidgets();
};

exports.nav = Widget.define({
    events: {
        'click [data-role="list"]' : function () {
            this.tolist();
        }
    },
    init: function (config) {
        this.config = config;
    },
    tolist: function () {
        User.tryLogin()
            .done(function() {
                if (!NativeAPI.isSupport()) {
                    Util.redirect('app/client/app/fenqi/view/order_list.js');
                    return;
                }
                NativeAPI.invoke('createWebView',
                {
                    url: window.location.pathname + '#' + 'app/client/app/fenqi/view/order_list.js'
                });
            });
    }
});

