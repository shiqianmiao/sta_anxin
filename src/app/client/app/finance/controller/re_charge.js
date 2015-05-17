require('app/client/app/finance/style/loan.jcss');
var template = require('../template/re_charge.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var Widget = require('com/mobile/lib/widget/widget.js');


exports.init = function() {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
            Util.redirect(url);
        } else {

            $('body')
                .removeClass('loading')
                .append(template());

            Widget.initWidgets();
        }
    });
};