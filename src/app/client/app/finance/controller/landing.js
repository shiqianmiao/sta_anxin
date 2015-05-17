var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var FinanceUtil = require('app/client/app/finance/controller/util.js');

var showLoginPage = function(user_id) {
    var httpApi = new HTTPApi({
        path: '/webapp/jinrong'
    });

    httpApi.request('GET', {}, '/zizhi/getlistingstatus', {
        user_id: user_id
    }, function(err, data) {
        data = data.data;
        // 未认证过
        var url = '';
        if (!data.listing_status) {
            url = 'app/client/app/finance/controller/deliver.js?classname=jslogin';
        } else {
            url = 'app/client/app/finance/controller/deliver.js?classname=jsloginauth';
        }
        Util.redirect(url);
    });
};

exports.init = function(config) {
    if(config.open_id) {
        FinanceUtil.saveOpenId(config.open_id);
    }

    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        var url = '';
        if (!userInfo) {
            // 去登录页
            url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js');

            if(config.open_id) {
                url += '&open_id=' + config.open_id;
            }

            Util.redirect(url);
        } else if (userInfo && !userInfo.phone) {
            // 绑定手机号
            url = 'app/client/common/view/account/bind_phone.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js');

            if(config.open_id) {
                url += '&open_id=' + config.open_id;
            }

            Util.redirect(url);

        } else {
            if (config.from) {
                var httpApi = new HTTPApi({
                    path: '/webapp/jinrong'
                });

                var open_id = Cookie.get('gj-weixin-openid');

                // 关联open_id与user_id;
                httpApi.request('GET', {}, '/user/bindopenid', {
                    user_id: userInfo.user_id,
                    open_id: open_id,
                    time: new Date().getTime()
                }, function(err) {
                    if (err) {
                        Util.toast(err.message);
                    } else {
                        if (config.target_url) {
                            Util.redirect(config.target_url);
                            return false;
                        }

                        setTimeout(function() {
                            if (config.from === 'forget_password') {
                                Util.redirect('app/client/app/finance/controller/deliver.js?classname=jsforgot');
                            } else if (config.from === 'bind_phone') {
                                Util.redirect('app/client/app/finance/controller/deliver.js?classname=jsbinding');
                            } else if (config.from === 'login') {
                                showLoginPage(userInfo.user_id);
                            } else if (config.from === 'register') {
                                Util.redirect('app/client/app/finance/controller/deliver.js?classname=jsreg');
                            }
                        }, 0);
                    }
                    return false;
                });
            } else {
                if (config.target_url) {
                    Util.redirect(config.target_url);
                } else {
                    showLoginPage(userInfo.user_id);
                }
            }
        }
    });
};