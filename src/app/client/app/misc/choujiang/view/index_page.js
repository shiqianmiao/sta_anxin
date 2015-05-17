var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('app/client/app/misc/choujiang/template/index_page.tpl');
var CJAPI       = require('app/client/app/misc/choujiang/service/api.js');
var BasePage    = require('app/client/app/misc/choujiang/widget/base_page.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var Shake       = require('com/mobile/widget/shake/shake.js').shake;
var Util        = require('app/client/common/lib/util/util.js');
var Storage     = require('app/client/app/sm/util/storage.js');

require('com/mobile/lib/iscroll/iscroll.js');

/*style*/
require('../style/style.css');

var User = BasePage.user;

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '进群抽奖'
        }
    );
    User.getUserInfo(function (userInfo) {
        var userId = (userInfo && userInfo.user_id) || 0;
        CJAPI.getIndexData({user_id: userId}, function (err, data) {
            var newUserId = userId;
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
            $body.append(template({data: data}));
            Widget.initWidgets();
            Storage.get('is_first_choujiang', function (oldId) {
                if (parseInt(newUserId, 10) !== parseInt(oldId, 10)) {
                    $('#info')
                        .trigger('alert::pop');

                    Storage.set('is_first_choujiang', newUserId);

                    return new window.IScroll(($('#info').find('.rule-box'))[0]);
                }
            });
            exports.registerToQunliao();
        });
    });
};

exports.lottery = Shake.extend({
    events: {
    },
    listen: function () {
        this.$el    = this.config.$el;
        this.$count = $(this.config.refer || '#count');
        this.count  = this.$count.data('count');
        this.pending= false;
        if (this.count > 0) {
            this.handleShake();
        }
    },
    onShake: function () {
        var self = this;
        if (this.count > 0) {
            if (!this.pending) {
                this.pending = true;
                this.$el.removeClass('static').addClass('active');
                this.lottery(function (err, data) {
                    if (err) {
                        Util.toast(err.message);
                        self.$el.removeClass('active');
                        if (err.code === -1010) {
                            self.pending = false;
                        }
                        return;
                    }
                    self.$el.removeClass('active').addClass('static');
                    self.count = parseInt(data.lottery_times, 10);
                    self.$count.data('count', self.count).text((self.count < 0 ? 0 : self.count));
                    require.async('app/client/app/misc/choujiang/template/widget/prize.tpl', function (prizeTpl) {
                        $('#lottery').trigger('alert::pop', {
                            $el: self.$el,
                            content: prizeTpl({
                                data: data.price
                            })
                        });
                        self.$el.one('alert::close', function () {
                            if (self.count > 0) {
                                self.pending = false;
                                self.$el.removeClass('static');
                            }
                        });
                        self.$el.one('alert::off', function () {
                            if (self.count > 0) {
                                self.pending = false;
                                self.$el.removeClass('static');
                            }
                            if (data.price && data.price.product_type !== '10') {
                                exports.toPrize({isRules: 1});
                            } else {
                                exports.toAddress({productName: data.price.name, isMod: 0});
                            }
                        });
                    });
                });
            }
        } else {
            Util.toast('没有摇奖机会了');
            this.$el.removeClass('active').addClass('static');
        }
    },
    lottery: function (callback) {
        User.tryLogin()
            .done(function (userInfo) {
                CJAPI.lottery({user_id: userInfo.user_id}, callback);
            });
    }
});

exports.info = Widget.define({
    events:{
        'tap [data-role="participate"]' : function () {
            this.participate();
        },
        'tap [data-role="info"]': 'showInfo',
        'tap [data-role="prize"]': 'showPrize'
    },
    init: function (config) {
        this.config = config;
    },
    participate: function () {
        // 加入群组
        $('#participate').trigger('alert::pop');
    },
    showInfo: function () {
        $('#info')
            .trigger('alert::pop');
        return new window.IScroll(($('#info').find('.rule-box'))[0]);
    },
    showPrize: function () {
        User.tryLogin().done(function () {
            exports.toPrize();
        });
    }
});
exports.getPrize = Widget.define({
    events:{
        'tap [data-role=part]': function (e) {
            var $cur = $(e.currentTarget);
            if (!$cur.prop('disabled')) {
                this.getPrize($cur);
            }
        }
    },
    init: function (config) {
        this.config = config;
    },
    getPrize: function ($cur) {
        var self = this;
        var type = $cur.data('tag');
        if (type) {
            User.tryLogin().done(function (userInfo) {
                CJAPI.regWelfare({
                    type: type,
                    user_id: userInfo && userInfo.user_id
                }, function (err) {
                    if (err) {
                        if (err.code === -1004) {
                            $('#failPop').trigger('alert::pop');
                        }
                        return;
                    }
                    $('#successPop').trigger('alert::pop', {$el: self.config.$el});
                    self.disable($cur);
                    $cur.text('报名成功');
                });
            });
        }
    },
    disable: function ($dom) {
        $dom.prop('disabled', true);
    },
    enable: function ($dom) {
        $dom.prop('disabled', false);
    }
});
exports.registerToQunliao = function () {
    $('body').on('click', '[data-key="toQunliao"]' ,function () {
        NativeAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
            if (!err) {
                if (deviceInfo && deviceInfo.versionId >= '6.0.0') {
                    NativeAPI.invoke('createNativeView', {
                        name: 'groupChatMsgbox'
                    });
                    return;
                }
            }
            Util.toast('当前版本太低，请升级您的赶集app');
        });
    });
};
exports.toAddress = function (config) {
    var url = '#app/client/app/misc/choujiang/view/address.js?refer=' + (config && encodeURIComponent(JSON.stringify(config)));
    NativeAPI.invoke('createWebView', {
        url: window.location.pathname + url
    });
};

exports.toPrize = function (config) {
    var url = '#app/client/app/misc/choujiang/view/prize_list_page.js?isRules=' + encodeURIComponent((config && config.isRules) || 0);
    NativeAPI.invoke('createWebView', {
        url: window.location.pathname + url
    });
};