require('app/client/common/view/account/style.css');

var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var template = require('../template/deliver.tpl');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');

exports.init = function (config) {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if(!userInfo) {
            // 去登录页
            Util.redirect('app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js'));
        } else {
            $('body')
                .removeClass('loading')
                .append(template({
                    className: config.classname || 'jsreg',
                    user_id: userInfo.user_id
                }));

            Widget.initWidgets();
        }
    });
};
