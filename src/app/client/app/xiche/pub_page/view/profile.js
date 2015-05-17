var $ = require('$');
var template = require('../template/profile.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var async = require('com/mobile/lib/async/async.js');
var Util = require('app/client/common/lib/util/util.js');
var XicheAPI = require('../lib/xiche_api.js');
var XicheUtil = require('../lib/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var HybridAPI = require('app/client/common/lib/api/index.js');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function () {
    BasePage.init();

    var getUserInfoDefer = $.Deferred();
    var loginDefer = $.Deferred();

    HybridAPI.invoke('getUserInfo', null)
        .done(function (userInfo) {
            loginDefer.resolve(userInfo);
        })
        .fail(function () {
            if (NativeAPI.isSupport()) {
                NativeAPI.invoke('login', null, function (err, userInfo) {
                    if (err) {
                        NativeAPI.invoke('alert', {
                            title: '提示',
                            message: '请登录后再试',
                            btn_text: '确定'
                        }, function () {
                            XicheUtil.redirectToIndexPage();
                        });
                    } else {
                        loginDefer.resolve(userInfo);
                    }
                });
            } else {
                loginDefer.reject();
            }
        });

    loginDefer
        .done(function () {
            XicheAPI.getUserCenterInfo(null)
                .done(function (userInfo) {
                    getUserInfoDefer.resolve(userInfo);
                })
                .fail(function (err) {
                    if (err && err.code === 'ERR_NEED_BIND_PHONE') {
                        XicheUtil.redirectToLoginPage('bindphone');
                        return;
                    } else {
                        $('body').removeClass('loading').addClass('offline');
                    }
                });
        })
        .fail(function () {
            XicheUtil.redirectToLoginPage('login');
        });

    getUserInfoDefer
        .done(function (userInfo) {
            async.auto({
                redPacketInfo: function(next) {
                    XicheAPI.getRedPacketList({
                        page_size: 0
                    })
                        .done(function (data) {
                            next(null, data);
                        })
                        .fail(function (err) {
                            next(err);
                        });
                },
                couponInfo: function(next) {
                    XicheAPI.getCouponList({
                        page_size: 0
                    })
                        .done(function (data) {
                            next(null, data);
                        })
                        .fail(function (err) {
                            next(err);
                        });
                }
            }, function (err, result) {
                var $body = $('body');

                $body.removeClass('loading');

                if (err) {
                    $body.addClass('offline');
                    return;
                }

                $body
                    .append(template({
                        userCenterInfo: userInfo,
                        redPacketInfo: result.redPacketInfo,
                        couponInfo: result.couponInfo,
                        isGanjiAPP: NativeAPI.isSupport()
                    }));

                Widget.initWidgets();

                BasePage.afterInitWidget();
            });
        });
};

exports.main = Widget.define({
    events: {
        'click [data-role="logout"]': 'logout'
    },
    init: function(config) {
        this.config = config;
    },
    logout: function() {
        XicheAPI.logout()
            .done(function () {
                Util.redirect('app/client/app/xiche/pub_page/view/index.js');
            });
    }
});
