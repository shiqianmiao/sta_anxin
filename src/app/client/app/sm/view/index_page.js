var $                 = require('$');
var Widget            = require('com/mobile/lib/widget/widget.js');
var template          = require('../template/index_page.tpl');
var userInfoTpl       = require('app/client/app/sm/template/widget/user_info.tpl');
var hotProductListTpl = require('app/client/app/sm/template/widget/hot_product_list.tpl');
var bannerListTpl     = require('app/client/app/sm/template/widget/banner.tpl');
var SMAPI             = require('app/client/app/sm/service/sm_api.js');
var HybridAPI         = require('app/client/common/lib/api/index.js');
var NativeAPI         = require('app/client/common/lib/native/native.js');

var BasePage          = require('app/client/app/sm/view/base_page.js');
var Storage           = require('app/client/app/sm/util/storage.js');
var routePage = {
    LOG_LIST_PAGE: window.location.pathname + '#app/client/app/sm/view/points/points_log_page.js',
    TASK_PAGE:     window.location.pathname + '#app/client/app/sm/view/task/task_page.js',
    MY_PRIZE_PAGE: window.location.pathname + '#app/client/app/sm/view/prize/prize_list_page.js',
    DETAIL_PAGE: 'app/client/app/sm/view/detail_page.js'
};
var DateParser  = require('app/client/app/sm/util/date_parse.js');

var gjLog = require('app/client/common/lib/log/log.js');

/*style*/
require('../style/style.css');

var shareConfig = BasePage.shareConfig;

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '积分商城'
        }
    );
    gjLog.setGjch('/client/app/sm/view/index_page');
    NativeAPI.invoke('updateHeaderRightBtn',{
        action:'show',
        text: '分享',
        icon: 'share'
    }, function (err) {
        if (err) {
            return;
        }
        gjLog.send('index_share');
    });

    SMAPI.getProductList('all',function (err, data) {
        var $body = $('body');
        $body.removeClass('loading');
        if (err) {
            $body.addClass('offline');
            return;
        }
        if (!data) {
            $body.addClass('nothing');
            return;
        }
        data.detailPageLink = routePage.DETAIL_PAGE;
        var date = Date.now();
        var now_day_time = DateParser.parseToHM(date);
        var bgt = 1000;
        var edt = 1000;
        data.forEach(function (item, index) {
            if (item.sold_date || item.sold_day_begin || item.sold_day_end) {
                var sold_date = item.sold_date && DateParser.parseToYMD(item.sold_date * 1000).substring(3),
                    sold_day_begin = item.sold_day_begin && DateParser.parseToHM(item.sold_day_begin * 1000) || '00:00',
                    sold_day_end = item.sold_day_end && (DateParser.parseToHM(item.sold_day_end * 1000) === '00:00' ? '24:00' : DateParser.parseToHM(item.sold_day_end * 1000)) || '23:59';
                if (sold_date && date < item.sold_date * 1000) {
                    item.clockCode = 1001;
                    item.timeStr = sold_date.replace(/-/g, '.') + '日 ' + (sold_day_begin);
                } else if (item.sold_day_begin || item.sold_day_end) {
                    item.timeStr = sold_day_begin;
                    item.endStr = sold_day_end;

                    var ns = now_day_time.split(':');
                    var bs = sold_day_begin.split(':');
                    var es = sold_day_end.split(':');
                    var bt = (bs[0] * 3600 + bs[1] * 60) - (ns[0] * 3600 + ns[1] * 60);
                    var et = (ns[0] * 3600 + ns[1] * 60) - (es[0] * 3600 + es[1] * 60);
                    if (bt > 0) {
                        if ( bgt > bt ) {
                            bgt = bt;
                        }
                        item.clockCode = 1003;
                    }
                    if (et > 0) {
                        item.clockCode = 1004;
                        return;
                    }
                    if (et > 0 && edt > et) {
                        edt = et;
                    }
                }
                data[index] = item;
            }
        });
        setTimeout(function () {
            window.location.reload();
        }, (edt > bgt ? bgt : edt) * 1000);

        $body.append(template({list: data}));
        NativeAPI.registerHandler('headerRightBtnClick',
                    function () {
                        NativeAPI.invoke('showShareDialog',
                            {
                                text: shareConfig.title,
                                title : shareConfig.title,
                                content: shareConfig.brief,
                                url: shareConfig.wapUrl,
                                img: shareConfig.images
                            },
                            function (err){
                                if (err) {
                                    window.alert(err);
                                }
                            });
                    });
        BasePage.bindNativeA();
        Widget.initWidgets();
    });

};

exports.user = Widget.define({
    events: {
        'click [data-role="userInfo"]': function (e) {
            e.preventDefault();
            if (!this.userId) {
                this.gotoLogin();
            }else{
                NativeAPI.invoke('createWebView',{ url: routePage.LOG_LIST_PAGE + '?page_index=0'});
            }
        },
        'click [data-role="earnPoint"]': function () {
            NativeAPI.invoke('createWebView', { url: routePage.TASK_PAGE});
        },
        'click [data-role="myPrize"]': function () {
            if (!this.userId) {
                this.gotoLogin();
            }else{
                NativeAPI.invoke('createWebView', { url: routePage.MY_PRIZE_PAGE });
            }
        }
    },
    init: function (config) {
        var self        = this;
        this.config     = config;
        this.$el        = config.$el;
        this.user       = null;
        this.userId     = 0;
        this.credit     = 0;
        this.oldChange  = 10001;

        this.getUserInfo()
            .done(function (userInfo) {
                if (userInfo) {
                    self.userId = userInfo.user_id;
                    self.getUser(userInfo.user_id, function (data) {
                        data.user_avatar = userInfo.user_avatar;
                        self.user = data;
                        self.credit = data.credit;
                        self.$el
                            .data('userId', self.userId);
                        self.renderuserInfo(data).addClass('active');
                    });

                    Storage.set('exchange_credite', self.oldChange, function () {
                        self.userLoop();
                    });


                }
            }).fail(function () {
                self.renderuserInfo();
            });

    },
    gotoLogin: function () {
        var self = this;
        self.login()
        .done(function (userInfo) {
            if (userInfo) {
                self.userId = userInfo.user_id;
                self.getUser(userInfo.user_id, function (data) {
                    data.user_avatar = userInfo.user_avatar;
                    self.user = data;
                    self.credit = data.credit;
                    self.$el
                        .data('userId', self.userId);
                    self.renderuserInfo(data).addClass('active');

                    Storage.set('exchange_credite', self.oldChange, function () {
                        self.userLoop();
                    });
                });
            }
        });
    },
    login: function () {
        var userDefer = $.Deferred();
        NativeAPI.invoke('login', null, function (err, userInfo) {
            if (err) {
                userDefer.reject(err);
            } else {
                userDefer.resolve(userInfo);
            }
        });
        return userDefer;
    },
    getUserInfo: function () {
        var getUserInfoDefer = $.Deferred();
        HybridAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (err) {
                getUserInfoDefer.reject(err);
            }

            getUserInfoDefer.resolve(userInfo);
        });
        return getUserInfoDefer;
    },
    getUser: function (userId, callback) {
        var params = {
            userId: userId
        };
        SMAPI.getUser(params, function (err, data) {
            if (err) {
                window.alert(err);
                return;
            }
            callback(data);
        });
    },
    renderuserInfo: function (userInfo) {
        return this.config.$userInfo
                .html(userInfoTpl({userInfo: userInfo}))
                .show();
    },
    getUserId: function () {
        return this.userId;
    },
    userLoop: function () {
        var self = this;
        Storage.get('exchange_credite', function (data) {
            if (data && self.oldChange !== data ) {
                self.oldChange = data;
                window.location.reload();
            }
        });
        setTimeout(function () {
            self.userLoop();
        }, 3000);
    }
});

exports.hotProductList = function (config) {
    SMAPI.getProductList('hot', function (err, data) {
        if (!err) {
            var jsALink = routePage.DETAIL_PAGE;
            if (data.length > 0) {
                config.$el.show();
            }
            config.$scrollWrap.html(hotProductListTpl({
                list: data,
                jsALink : jsALink
            }));
            if (data.length >= 4) {
                Widget.ready('[data-widget="com/mobile/widget/marquee.js"]', function (wg) {
                    wg.restart();
                });
            }
        }
    });
};
exports.bannerList = function (config) {
    SMAPI.getBannerList(function (err, data) {
        if (!err) {
            if (data.length <= 0) {
                return;
            }
            config.$el.html(bannerListTpl({list: data}));
            Widget.initWidget('[data-widget="com/mobile/widget/responsiveBanner.js"]');
        }
    });
};
exports.productNews = function (config) {
    SMAPI.getProductNews(function (err, data) {
        if (!err && data.total) {
            var dateUnit = data.frequency === 'week' ? '周' : '个月';
            config.$el.text('近一' + dateUnit + '新增' + data.total + '件商品');
        }
    });
};