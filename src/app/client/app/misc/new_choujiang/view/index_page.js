var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('app/client/app/misc/new_choujiang/template/index_page.tpl');
var CJAPI       = require('app/client/app/misc/new_choujiang/service/api.js');
var BasePage    = require('app/client/app/misc/new_choujiang/widget/base_page.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var Shake       = require('com/mobile/widget/shake/shake.js').shake;
var Storage     = require('app/client/app/sm/util/storage.js');

/*style*/
require('../style/style.css');

var User = BasePage.user;

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '商城摇摇乐'
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
            data.user_id = userId;
            $body.append(template({data: data}));
            Widget.initWidgets();
            Storage.get('is_first_new_choujiang', function (oldId) {
                if (newUserId && parseInt(newUserId, 10) !== parseInt(oldId, 10)) {
                    setTimeout(function () {
                        $('#info')
                            .trigger('alert::pop');
                    }, 0);
                    Storage.set('is_first_new_choujiang', newUserId);
                }
            });
        });
    });
};

exports.lottery = Shake.extend({
    events: {},
    listen: function () {
        this.$el    = this.config.$el;
        this.$count = $(this.config.refer || '#count');
        this.count  = this.$count.data('count');
        this.pending= false;
        if (this.config.shakeAbled) {
            this.handleShake();
        }
    },
    onShake: function () {
        var self = this;
        if ($('[data-widget="app/client/app/misc/new_choujiang/widget/base_page.js#alertPop"]').hasClass('active')) {
            return false;
        }
        if (this.count > 0) {
            if (!this.pending) {
                this.pending = true;
                this.$el.removeClass('static').addClass('active');
                this.lottery(function (err, data) {
                    if (err) {
                        // Util.toast(err.message);
                        self.$el.removeClass('active');
                        $('#errorPop').trigger('alert::pop', {
                            $el: self.$el,
                            content: err.message
                        });
                        if (err.code === -2) {
                            // 达到上限
                            $('#errorPop').find('[data-role=confirm]').show();
                            self.$el.one('alert::confirm', function () {
                                NativeAPI.invoke('createWebView',
                                    {
                                        url : window.location.pathname + '#app/client/app/sm/view/task/task_page.js'
                                    }
                                );
                            });
                        }else {
                            self.pending = false;
                        }
                        return;
                    }

                    self.$el.removeClass('active').addClass('static');
                    self.count = parseInt(data.lottery_remain, 10);
                    self.$count.data('count', self.count).text((self.count < 0 ? 0 : self.count));
                    if (data.lottery_status === 0) {
                        $('#errorPop').trigger('alert::pop', {
                            $el: self.$el,
                            content: data.lottery_message
                        });
                        if (self.count > 0) {
                            self.pending = false;
                            self.$el.removeClass('static');
                        }
                        return;
                    }
                    require.async('app/client/app/misc/new_choujiang/template/widget/prize.tpl', function (prizeTpl) {
                        $('#lottery').trigger('alert::pop', {
                            $el: self.$el,
                            content: prizeTpl({
                                data: data
                            })
                        });
                        self.$el.one('alert::close', function () {
                            if (self.count > 0) {
                                self.pending = false;
                                self.$el.removeClass('static');
                            }
                        });
                        self.$el.one('alert::confirm', function () {
                            if (self.count > 0) {
                                self.pending = false;
                                self.$el.removeClass('static');
                            }
                            if (data.lottery_status !== 2) {
                                var url = '#app/client/app/sm/view/prize/exchange_page.js?prize_info=';
                                var theData = data.lottery_product;
                                theData.discribe && delete theData.discribe;
                                theData.other_discribe && delete theData.other_discribe;
                                theData.rules && delete theData.rules;

                                var configObj = $.extend(theData, {
                                    product_id: theData.id,
                                    user_name: self.userInfo.userName,
                                    user_id: self.userInfo.user_id,
                                    pay_code: data.lottery_pay_code,
                                    is_from_choujiang: true,
                                    product_name: theData.name,
                                    product_type: theData.product_type
                                });
                                if (data.lottery_status === 3) {
                                    url = '#app/client/app/sm/view/prize/address.js?prize_info=';
                                    configObj = $.extend(configObj, data.lottery_order || {});
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
                    });
                });
            }
        } else {
            $('#errorPop').trigger('alert::pop', {
                $el: self.$el,
                content: '您当天的摇奖次数已用完，明天再来哦'
            });
            this.$el.removeClass('active').addClass('static');
        }
    },
    lottery: function (callback) {
        var self = this;
        User.tryLogin()
            .done(function (userInfo) {
                self.userInfo = userInfo;
                CJAPI.lottery({user_id: userInfo.user_id}, function (err, data) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback && callback(null, data);
                });
            });
    }
});

exports.info = Widget.define({
    events:{
        'tap [data-role="login"]' : function () {
            this.login();
        }
    },
    init: function (config) {
        this.config = config;
    },
    login: function () {
        User.tryLogin()
            .done(function () {
            Storage.set('exchange_credite', Date.now(), function () {
                window.location.reload();
            });
        });
    }
});

