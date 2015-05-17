require('app/client/app/finance/style/loan.jcss');
var template = require('../template/person_charge.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.init = function() {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
            Util.redirect(url);
        } else {
            httpApi.request('GET', {}, '/user/moneylog', {
                    user_id: userInfo.user_id,
                    page: 1
                })
                .done(function(data) {
                    var globalMsgMap = {
                        '403': '请重新登录',
                        '407': '手机号未绑定'
                    };

                    if (data.status - 0 === 403 || data.status - 0 === 407) {
                        Util.toast(globalMsgMap[data.status+''], 2000);
                        setTimeout(function() {
                            var url = 'app/client/common/view/account/login.js?back_url=';

                            if(data.status - 0 === 407) {
                                url = 'app/client/common/view/account/bind_phone.js?back_url=';
                            }

                            url += encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));

                            Util.redirect(url);
                        }, 2000);

                        return false;
                    }

                    var moneyLog = data.data;

                    $.each(moneyLog, function(i) {
                        var item = moneyLog[i];
                        if(!item.isCharge) {
                            item.className = 'add';
                        } else {
                            item.className = 'lose';
                            item.money = '-' + item.money;
                        }
                    });

                    $('body')
                        .removeClass('loading')
                        .append(template({
                            moneyLog: moneyLog,
                            user_id: userInfo.user_id
                        }));

                    Widget.initWidgets();
                });
        }
    });
};