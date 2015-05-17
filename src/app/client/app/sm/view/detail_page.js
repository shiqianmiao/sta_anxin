var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('../template/detail_page.tpl');
var SMAPI       = require('app/client/app/sm/service/sm_api.js');
var HybridAPI   = require('app/client/common/lib/api/index.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var Util        = require('app/client/common/lib/util/util.js');

var BasePage    = require('app/client/app/sm/view/base_page.js');

var Storage    = require('app/client/app/sm/util/storage.js');
var DateParser  = require('app/client/app/sm/util/date_parse.js');

require('../style/style.css');
function getConfig (data) {
    if (data.sold_date || data.sold_day_begin || data.sold_day_end) {
        var date = Date.now();
        var sold_date = data.sold_date && DateParser.parseToYMD(data.sold_date * 1000).substring(3),
            sold_day_begin = data.sold_day_begin && DateParser.parseToHM(data.sold_day_begin * 1000) || '00:00',
            sold_day_end = data.sold_day_end && (DateParser.parseToHM(data.sold_day_end * 1000) === '00:00' ? '24:00' : DateParser.parseToHM(data.sold_day_end * 1000)) || '23:59';
        if (sold_date && date < data.sold_date * 1000) {
            data.clock_code = 1001;
            data.time_str = sold_date.replace(/-/g, '.') + '日 ' + (sold_day_begin);
        } else if (data.sold_day_begin || data.sold_day_end) {
            data.time_str = sold_day_begin;
            data.end_str = sold_day_end;
        }
    }
    return data;
}
function parseData(data) {
    var now = DateParser.parseToHM(Date.now());
    var config = getConfig(data);
    var begin = config.time_str;
    var end = config.end_str;
    var ns = now.split(':');
    var bs = begin.split(':');
    var es = end.split(':');
    var bt = (bs[0] * 3600 + bs[1] * 60) - (ns[0] * 3600 + ns[1] * 60);
    var et = (es[0] * 3600 + es[1] * 60) - (ns[0] * 3600 + ns[1] * 60);
    if (!config.clock_code) {
        if (bt > 0) { // 还没开始
            config.clock_code = 1003;
            setTimeout(function () {
                window.location.reload();
            }, bt * 1000);
        }else {
            config.clock_code = null;
            Storage.set('exchange_credite', Date.now());
        }
        if (et <= 0) { // 过了时间
            config.clock_code = 1004;
            Storage.set('exchange_credite', Date.now());
        }else {
            setTimeout(function () {
                window.location.reload();
            }, et * 1000);
        }
    }
    return data;
}
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '奖品详情'
        }
    );
    SMAPI.getProductDetail(config.product_id, function (err, data) {
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
        $body.append(
            template({
                data: $.extend(parseData(data) , config)
            })
        );
        BasePage.bindNativeA();
        BasePage.setGjch('/client/app/sm/view/detail_page');
        Widget.initWidgets();
    });

};

exports.exchange = Widget.define({
    events: {
        'click [data-role="btn"]': function (e) {
            e.preventDefault();
            var $cur = $(e.currentTarget);
            if(!$cur.attr('disable') && !this.pending){
                this.showConfirmPop();
            }
        },
        'Events::confirm': function () {
            this.exchange();
            BasePage.log('exchange_confirm_1');
        },
        'Events::tipOff': function () {
            this.pending = false;
            BasePage.log('exchange_fail_lack_2');
        },
        'Events::cancel':function () {
            BasePage.log('exchange_confirm_0');
        }
    },
    init : function (config) {
        this.config    = config;
        this.$refer    = $(config.refer);
        this.$tipRefer = $(config.tipRefer);
        this.productId = config.productId;
        this.productType = config.productType;
        this.userId    = null;
        this.userName  = '';
        this.preventScroll();
        this.productName = config.productName;
    },
    showConfirmPop: function () {
        var self = this;
        self._getUserInfo()
            .done(function (userInfo) {
                if (userInfo.user_id) {
                    self.userId = userInfo.user_id;
                    self.userName = userInfo.username;

                    SMAPI.getUser({userId: userInfo.user_id}, function (err, data) {
                        if (err) {
                            window.alert(err);
                            return;
                        }
                        if(data.credit && data.credit > self.config.price) {
                            self.$refer.trigger('Events::confirmPop', {$el: self.config.$el});
                        }else{
                            self.alertFail();
                        }
                    });

                }
            });
        BasePage.log('exchange_confirm');
    },
    _getUserInfo: function () {
        var getUserInfoDefer = $.Deferred();
        HybridAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (err) {
                NativeAPI.invoke('login', null, function (err, userInfo) {
                    if (err) {
                        getUserInfoDefer.reject(err);
                    } else {
                        getUserInfoDefer.resolve(userInfo);
                    }
                });
                return;
            }
            getUserInfoDefer.resolve(userInfo);
        });
        return getUserInfoDefer;
    },
    exchange: function () {
        var self  = this;
        var rest  = parseInt(self.config.$rest.text(), 10);
        if (self.pending) {
            return;
        }
        self.pending = true;
        if (self.userId) {
            SMAPI.buyProduct({
                userId: self.userId,
                productId: self.productId,
                product_type: self.productType
            }, function (err, data) {
                self.pending = false;
                if (err) {
                    if (err.code === -2) {
                        self.alertFail();
                    } else if (err.code === -1010) {
                        $('#errorPop').trigger('Events::alertPop');
                    } else {
                        Util.toast('今日奖品已兑完，明日再来');
                    }
                    return;
                } else {
                    self.config.$rest.text(--rest);
                    data.discribe && delete data.discribe;
                    data.other_discribe && delete data.other_discribe;
                    data.rules && delete data.rules;

                    var configObj = $.extend(data, {
                        product_id: self.productId,
                        user_name: self.userName,
                        user_id: self.userId,
                        product_name: self.productName,
                        product_type: self.productType
                    });
                    var url = '#app/client/app/sm/view/prize/exchange_page.js?prize_info=';
                    if (self.productType && parseInt(self.productType, 10) === 10) {
                        url = '#app/client/app/sm/view/prize/address.js?prize_info=';
                    } else {
                        Storage.set('exchange_credite', Date.now());
                    }
                    setTimeout(function () {
                        NativeAPI.invoke('createWebView',
                            {
                                url : window.location.pathname + url +  window.encodeURIComponent(JSON.stringify(configObj))
                            }
                        );
                    }, 0);
                }
            });
        }
    },
    enableBtn: function () {
        this.config.$btn.prop('disabled', false);
    },
    disableBtn: function () {
        this.config.$btn.prop('disabled', true);
    },
    alertFail: function  () {
        var self = this;
        self.$tipRefer.trigger('Events::alertPop', {$el: self.config.$el});
        BasePage.log('exchange_fail_lack');
    },
    preventScroll: function () {
        $('body')
            .on('touchmove', function (e) {
                if ($('#mask').hasClass('active')) {
                    e.preventDefault();
                }
            });
    }
});
