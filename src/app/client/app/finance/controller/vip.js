require('app/client/app/finance/style/loan.jcss');
var template = require('../template/person_index.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var FinanceUtil = require('app/client/app/finance/controller/util.js');

var httpApi = new HTTPApi({
    path: '/webapp/jinrong'
});

exports.init = function(config) {
    if(config.open_id) {
        FinanceUtil.saveOpenId(config.open_id);
    }

    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 更新open_id
            if(config.open_id) {
                Cookie.set('gj-weixin-openid', config.open_id, {
                    domain: '.ganji.com',
                    expires: 86400 * 14,
                    path: '/'
                });
            }
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
            Util.redirect(url);
        } else {
            httpApi.request('GET', {}, '/user/userinfo', {
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

                    var userData = data.data;

                    userData.zizhiStatus -= 0;

                    if(userData.zizhiStatus === 7) {
                        userData.zizhiText = '未提交';
                        userData.zizhiUrl = 'app/client/app/finance/controller/authenticate.js';
                    } else{
                        if(userData.zizhiStatus === 0) {
                            userData.zizhiText = '未审核';
                        } else if(userData.zizhiStatus === 1) {
                            userData.zizhiText = '审核中';
                        } else if(userData.zizhiStatus === 5) {
                            userData.zizhiText = '已认证';
                        } else if(userData.zizhiStatus === 6) {
                            userData.zizhiText = '未通过';
                        }
                        userData.zizhiUrl = 'app/client/app/finance/controller/authenticate_detail.js';
                    }

                    if(!userData.img_profile) {
                        userData.img_profile = 'http://sta.ganjistatic1.com/public/image/mobile/app/loan/avatar.png';
                    }

                    $('body')
                        .removeClass('loading')
                        .append(template({
                            userData: userData,
                            user_id: userInfo.user_id
                        }));

                    Widget.initWidgets();
                });
        }
    });
};