var HybridAPI = require('app/client/common/lib/api/index.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var BaseForm = require('com/mobile/widget/form2/form.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var AccountAPI = require('./lib/api');
var Util = require('app/client/common/lib/util/util.js');
var AccountAPI = require('./lib/api');

var $ = require('$');

var template = require('./template/forgotPwd.tpl');

require('./style.css');

var httpApi = new HttpAPI({
    path: '/users/'
});

var globalConfig = {};

exports.init = function(config) {
    $('body')
        .removeClass('loading')
        .append(template({
            phone: config.phone || ''
        }));

    globalConfig = config;

    switch (config.step) {
        case 2:
            $('#step-2').show();
            $('#step-1').hide();
            break;
        case 3:
            $('#step-3').show();
            $('#step-1').hide();
            break;
    }

    $('#step-1')
        .data('validations', {
            phone: {
                rules: [
                    ['required', true, '忘记填写手机号啦'],
                    ['regexp', '^1[34578]\\d{9}$', '手机号格式错误']
                ]
            },
            captcha: {
                rules: [
                    ['required', true, '忘记填写验证码啦'],
                    ['minLength', 4, '验证码格式错误'],
                    ['maxLength', 6, '验证码格式错误']
                ]
            }
        });

    $('#step-2')
        .data('validations', {
            authCode: {
                rules: [
                    ['required', true, '忘记填写验证码啦'],
                    ['minLength', 4, '验证码格式错误'],
                    ['maxLength', 6, '验证码格式错误']
                ]
            }
        });

    $('#step-3')
        .data('validations', {
            password: {
                rules: [
                    ['required', true, '忘记填写密码啦'],
                    ['minLength', 6, '密码格式错误，6-16个字符'],
                    ['maxLength', 16, '密码格式错误，6-16个字符'],
                    ['regexp', '[0-9A-Za-z]{6,}', '密码格式错误'],
                    ['regexp', '[A-Za-z]', '密码必须包含字母'],
                    ['regexp', '[0-9]', '密码必须包含数字']
                ]
            },
            rePassword: {
                rules: [
                    ['required', true, '忘记填写密码啦'],
                    ['compare', 'this == password', '两次输入的密码不一致']
                ]
            }
        })
        .on('reset-success', function() {
            var pramsObj = config;
            var back_url = config.back_url;
            pramsObj.from = 'forget_password';
            delete config.back_url;

            if (back_url) {
                AccountAPI.goBackUrl(back_url, pramsObj);
            }
        });

    Widget.initWidgets();
};

exports.step1Form = BaseForm.extend({
    events: {
        // 'change [data-role="field"]': function(e) {
        //     var trigger = $(e.currentTarget).data('trigger');
        //     if (trigger === 'change') {
        //         var name = $(e.currentTarget).data('name');
        //         this.validateField(name);
        //     }
        // },
        // 离开某个字段
        'blur [data-role="field"]': function(e) {
            var trigger = $(e.currentTarget).data('trigger');
            if (trigger !== 'change') {
                var name = $(e.currentTarget).data('name');
                this.validateField(name);
            }
        },
        // 表单验证正确
        'form-valid': function() {
            var formData = this.config.$el.serializeObject();

            httpApi.request('POST', {
                    'interface': 'GetBackPassword'
                }, '', {
                    step: 1,
                    method: 1,
                    methodKey: formData.phone,
                    imageCode: formData.captcha
                })
                .done(function(data) {
                    if (data.status === 0) {
                        delete globalConfig.redirect;
                        var url = 'app/client/common/view/account/forget_password.js?step=2&phone=' + formData.phone + '&' + $.param(globalConfig);

                        return Util.redirect(url);
                    }

                    Util.toast(data.errDetail, 1500);
                })
                .fail(function() {
                    Util.toast('网络异常，请稍候再试', 1500);
                });
        },
        'tap [data-role="captcha"]': 'refreshCaptcha'
    },
    init: function(config) {
        this.super_.init.call(this, config);
        this.refreshCaptcha();
    },
    refreshCaptcha: function() {
        var $img = this.config.$captcha.find('img');
        HybridAPI.invoke('getDeviceInfo', null)
            .done(function(deviceInfo) {
                var uuid = deviceInfo.userId;
                $img.attr('src', 'http://wap.ganji.com/ajax.php?module=mclient_captcha' +
                    '&dir=common&type=get_password&tag=phone&w=120&h=35' +
                    '&nocache=' + Date.now() +
                    '&uuid=' + uuid +
                    '&customerId=' + deviceInfo.customerId
                );
            });
    }
});

exports.step2Form = BaseForm.extend({
    events: {
        // 'change [data-role="field"]': function(e) {
        //     var trigger = $(e.currentTarget).data('trigger');
        //     if (trigger === 'change') {
        //         var name = $(e.currentTarget).data('name');
        //         this.validateField(name);
        //     }
        // },
        // 离开某个字段
        'blur [data-role="field"]': function(e) {
            var trigger = $(e.currentTarget).data('trigger');
            if (trigger !== 'change') {
                var name = $(e.currentTarget).data('name');
                this.validateField(name);
            }
        },
        // 表单验证正确
        'form-valid': function() {
            var formData = this.config.$el.serializeObject();
            var phone = this.config.phone;

            httpApi.request('POST', {
                    'interface': 'GetBackPassword'
                }, '', {
                    step: 2,
                    method: 1,
                    methodKey: phone,
                    phoneCode: formData.authCode
                })
                .done(function(data) {
                    if (data.status === 0) {
                        delete globalConfig.redirect;
                        globalConfig.step = 3;

                        var url = 'app/client/common/view/account/forget_password.js?' + $.param(globalConfig);
                        return Util.redirect(url);
                    }

                    Util.toast(data.errDetail, 1500);
                })
                .fail(function() {
                    Util.toast('网络异常，请稍候再试', 1500);
                });
        },
        'tap [data-role="send"]': 'sendAuthCode'
    },
    init: function(config) {
        this.super_.init.call(this, config);
    },
    sendAuthCode: function() {
        var phone = this.config.phone;
        var $send = this.config.$send;
        var self = this;

        if ($send.prop('disabeld')) {
            return;
        }

        $send
            .prop('disabled', true)
            .text('发送中...');

        AccountAPI.sendAuthCode({
                phone: phone,
                getCodeType: 3
            })
            .done(function() {
                var count = 60;

                self.timer = setInterval(function() {
                    count--;
                    if (count < 0) {
                        clearInterval(self.timer);

                        self.resetSendBtn();
                        return;
                    }

                    $send.text(count + '秒后重发');
                }, 1000);
            })
            .fail(function(err) {
                self.resetSendBtn();
                Util.toast(err.message, 1500);
            });
    },
    resetSendBtn: function() {
        this.config.$send
            .prop('disabled', false)
            .text('获取短信验证码');
    }
});

exports.step3Form = BaseForm.extend({
    events: {
        // 'change [data-role="field"]': function(e) {
        //     var trigger = $(e.currentTarget).data('trigger');
        //     if (trigger === 'change') {
        //         var name = $(e.currentTarget).data('name');
        //         this.validateField(name);
        //     }
        // },
        // 离开某个字段
        'blur [data-role="field"]': function(e) {
            var trigger = $(e.currentTarget).data('trigger');
            if (trigger !== 'change') {
                var name = $(e.currentTarget).data('name');
                this.validateField(name);
            }
        },
        // 表单验证正确
        'form-valid': function() {
            var formData = this.config.$el.serializeObject();
            var self = this;
            httpApi.request('POST', {
                    'interface': 'GetBackPassword'
                }, '', {
                    step: 3,
                    method: 1,
                    methodKey: globalConfig.phone,
                    password: formData.password
                })
                .done(function(data) {
                    data.phone = globalConfig.phone;
                    AccountAPI.saveUserInfo(data);
                    self.config.$el.trigger('reset-success');
                })
                .fail(function() {
                    Util.toast('网络异常，请稍候再试', 1500);
                });
        }
    },
    init: function(config) {
        this.super_.init.call(this, config);
    }
});