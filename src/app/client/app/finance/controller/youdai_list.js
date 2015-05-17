require('app/client/app/finance/style/youdai_list.jcss');
var template = require('../template/youdai_list.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var API = require('app/client/common/view/account/lib/api.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrongyd'
});

var getUserInfo = function(config, callback) {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if(userInfo) {
            callback(userInfo);
        } else {
            API.autoLogin({
                user_id: config.user_id,
                ssid: config.ssid
            }, function(userInfo) {
                callback(userInfo, true);
            });
        }
    });
};

exports.init = function(config) {
    if(config.open_id && config.user_id) {
        API.removeUserInfo();
    }

    getUserInfo(config, function(userInfo, isAutoLogin) {
        if (!userInfo) {
            // 更新open_id
            if (config.open_id) {
                Cookie.set('gj-youdai-openid', config.open_id, {
                    domain: '.ganji.com',
                    expires: 86400 * 14,
                    path: '/'
                });
            }
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/youdai_list.js');
            Util.redirect(url);
        } else {

            if (config.from || isAutoLogin) {
                // 绑定 open_id
                var open_id = config.open_id || Cookie.get('gj-youdai-openid');
                var ticket = config.ticket;
                if(open_id) {
                    httpApi.request('GET', {}, '/user/bind', {
                        user_id: userInfo.user_id,
                        open_id: open_id,
                        ticket: ticket
                    });
                }
            }

            var page = config.page || 1;
            httpApi.request('GET', {}, '/apply/list', {
                    user_id: userInfo.user_id,
                    page: page
                })
                .done(function(data) {
                    var globalMsgMap = {
                        '403': '请重新登录'
                    };

                    if (data.status - 0 === 403) {
                        Util.toast(globalMsgMap[data.status + ''], 2000);

                        setTimeout(function() {
                            var url = 'app/client/common/view/account/login.js?back_url=';

                            url += encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));

                            Util.redirect(url);
                        }, 2000);

                        return false;
                    }

                    var listData = data.data;

                    $('body')
                        .removeClass('loading')
                        .append(template({
                            listData: listData,
                            page: page
                        }));

                    Widget.initWidgets();
                });
        }
    });
};