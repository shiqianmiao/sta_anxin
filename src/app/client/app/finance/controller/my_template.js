require('app/client/app/finance/style/template.jcss');
var template = require('../template/my_template.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');
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

            httpApi.request('GET', {}, '/template/list', {
                    user_id: userInfo.user_id
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

                    if (!data.status) {
                        var listArr = data.data || [];

                        $('body')
                            .removeClass('loading')
                            .append(template({
                                listArr: listArr,
                                user_id: userInfo.user_id
                            }));

                        Widget.initWidgets();
                    } else {
                        Util.toast(data.message);
                    }
                })
                .fail(function() {
                    Util.toast('获取数据失败');
                });
        }
    });
};