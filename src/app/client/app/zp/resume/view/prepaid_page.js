var Widget = require('com/mobile/lib/widget/widget.js');
var API = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

var $ = require('$');

require('app/client/app/zp/resume/style/resume.jcss');

exports.init = function (config) {
    this.config = config;
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '购买简历'
        }
    );
    getUserCityInfo(function(userInfo, cityInfo){
        API.getData(
            {
                'controller': 'Resume',
                'action': 'prepaidList',
                'user_id': userInfo.user_id,
                'city_id': cityInfo.city_id
            },
            function (err, data) {
                var tpl;
                var bodyClass = '';
                if (err) {
                    $('body')
                        .removeClass('loading')
                        .addClass('offline');
                    return;
                }

                $('body').removeClass('loading');
                if (data.is_promotion) {
                    if (data.pay_type === 'point') {//简历点
                        tpl = require('../template/pay/post_package_discount.tpl');
                    } else {//招聘币
                        tpl = require('../template/pay/currency_package_discount.tpl');
                    }
                    bodyClass = 'discount';
                }else{
                    if (data.pay_type === 'point') {//简历点
                        tpl = require('../template/pay/post_package.tpl');
                    } else {//招聘币
                        tpl = require('../template/pay/currency_package.tpl');
                    }
                }
                $('body').append(tpl(data)).addClass(bodyClass);
                Widget.initWidgets();
            }
        );
    });
};

exports.form = Widget.define({
    events: {
        'tap [data-role="submit"]': function () {
            var id = this.config.$input.filter(':checked').val();
            if (this.config.$el.hasClass('loading')) {
                return;
            }

            this.config.$el.addClass('loading');

            this.config.$submit.text('努力加载中...');

            this.submit(id);
        }
    },
    init: function (config) {
        this.config = config;
    },
    submit: function (id) {
        var self = this;
        NativeAPI.invoke('log', {
            code: 3123,
            value: this.config.type + ',' + id
        });
        getUserCityInfo(function(userInfo, cityInfo){
            API.getData({
                'controller': 'Resume',
                'action': 'spendMoney',
                'packageId': id,
                'city_id': cityInfo.city_id,
                'user_id': userInfo.user_id,
                'return_url': 'http://sta.ganji.com/' + window.location.pathname + '#app/client/app/zp/resume/view/pay_callback.js'
            }, function (err, data) {
                if (err) {
                    NativeAPI.invoke(
                        'alert',
                        {
                            title: '出错了!',
                            message: err.message,
                            btn_text: '确定'
                        }, function () {
                            self.config.$el.removeClass('loading');
                            self.config.$submit.text('提交');
                        }
                    );
                }
                if (data.consume_url) {
                    window.location.href = data.consume_url;
                }
            });
        });
    }
});
function getUserCityInfo(callback){
    var userInfoDefer = $.Deferred();
    var cityInfoDefer = $.Deferred();
    $.when(userInfoDefer, cityInfoDefer)
            .done(function (userInfo, cityInfo) {
                callback(userInfo, cityInfo);
            });
    userInfoDefer.fail(function () {
        NativeAPI.invoke('alert', {
            title: '出错了!',
            message: '无法获取用户信息!',
            btn_text: '确定'
        });
    });

    cityInfoDefer.fail(function () {
        NativeAPI.invoke('alert', {
            title: '出错了!',
            message: '无法获取城市信息!',
            btn_text: '确定'
        });
    });
    NativeAPI.invoke(
        'getCityInfo',
        null,
        function (err, cityInfo) {
            if (err) {
                cityInfoDefer.reject(err);
            } else {
                cityInfoDefer.resolve(cityInfo);
            }
        }
    );
    NativeAPI.invoke(
        'getUserInfo',
        null,
        function (err, userInfo) {
            if (err) {
                NativeAPI.invoke('login', null, function (err, userInfo) {
                    if (err) {
                        userInfoDefer.reject(err);
                    } else {
                        userInfoDefer.resolve(userInfo);
                    }
                });
            } else {
                userInfoDefer.resolve(userInfo);
            }
        }
    );
}