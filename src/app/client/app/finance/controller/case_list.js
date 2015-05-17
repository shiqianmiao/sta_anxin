require('app/client/app/finance/style/loan.jcss');
var template = require('../template/case_list.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var FinanceUtil = require('app/client/app/finance/controller/util.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.init = function(config) {
    // 更新open_id
    if(config.open_id) {
        FinanceUtil.saveOpenId(config.open_id);
    }

    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
            Util.redirect(url);
        } else {
            var timestamp = Math.floor(new Date().getTime() / 1000);
            httpApi.request('GET', {}, '/case/list', {
                    user_id: userInfo.user_id,
                    timestamp: timestamp,
                    category: 2,
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

                    var listData = data.data;
                    var storage = new Storage('weixinJR');
                    var readlists = storage.get('readlists') || [];

                    var btnTextMap = {
                        '1': '立即购买',
                        '2': '已购买',
                        '3': '例子被抢',
                        '4': '已过期'
                    };

                    $.each(listData, function(index) {
                        var item = listData[index];
                        item.btn_text = btnTextMap[item.case_status + ''];
                        item.template_name = item.template_name || [];

                        if($.inArray(item.case_id - 0, readlists) === -1) {
                            item.isRead = 0;
                        } else {
                            item.isRead = 1;
                        }

                        if(item.active_price && item.active_price - 0 > -1) {
                            item.isActive = 1;
                        }
                    });

                    $('body')
                        .removeClass('loading')
                        .append(template({
                            timestamp: timestamp,
                            user_id: userInfo.user_id,
                            case_list: listData
                        }));

                    Widget.initWidgets();
                });
        }
    });
};