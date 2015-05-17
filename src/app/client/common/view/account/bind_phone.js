var HybridAPI = require('app/client/common/lib/api/index.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var template = require('./template/bind_phone.tpl');
var Util = require('app/client/common/lib/util/util.js');
var BaseForm = require('com/mobile/widget/form2/form.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var AccountAPI = require('./lib/api');
var $ = require('$');

require('app/client/common/view/account/style.css');

var UserAPI = new HttpAPI({
    path: '/users/'
});

exports.init = function (config) {
    HybridAPI.invoke('getUserInfo', null)
        .done(function (userInfo) {
            $('body')
                .removeClass('loading')
                .append(template({
                    user_id: userInfo.user_id || ''
                }));

            $('#form')
                .data('validations', {
                    phone: {
                        rules: [
                            ['required', true, '忘记填写手机号啦'],
                            ['regexp', '^1[34578]\\d{9}$', '手机号格式错误']
                        ]
                    },
                    authCode: {
                        rules: [
                            ['required', true, '忘记填写验证码啦'],
                            ['minLength', 4, '验证码格式错误'],
                            ['maxLength', 6, '验证码格式错误']
                        ]
                    }
                })
                .on('bind-success', function (e, phone) {
                    var pramsObj = config;
                    var back_url = config.back_url;
                    pramsObj.from = 'bind_phone';
                    delete config.back_url;

                    userInfo.phone = phone;
                    AccountAPI.saveUserInfo(userInfo);
                    if (back_url) {
                        AccountAPI.goBackUrl(back_url, pramsObj);
                    }
                });

            Widget.initWidgets();
        })
        .fail(function () {
            Util.redirect('app/client/common/view/account/login.js?back_url=' +
                encodeURIComponent(window.location.href)
            );
        });
};

exports.form = BaseForm.extend({
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
        // 'input [data-role="field"][data-name="phone"]': function () {
        //     this.validateField('phone');
        // },
        // 表单验证正确
        'form-valid': function() {
            var formData = this.config.$el.serializeObject();
            var self = this;
            UserAPI.request('POST', {'interface': 'UserPhoneAuth'}, '', {
                'method':    'AuthCode',
                'loginId':   formData.userId,
                'phone':     formData.phone,
                'code':      formData.authCode
            })
                .done(function(data) {
                    if (data && data.status !== 0) {
                        Util.toast(data.errDetail, 1500);
                        return;
                    }
                    self.config.$el.trigger('bind-success', formData.phone);
                })
                .fail(function() {
                    Util.toast('网络异常，请稍后再试');
                });
        },
        'tap [data-role="send"]': function () {
            var $send = this.config.$send;
            if ($send.prop('disabled')) {
                return;
            }

            this.sendAuthCode();
        },
        'field-valid [data-role="field"][data-name="phone"]': function () {
            this.config.$send.prop('disabled', false);
        },
        'field-error [data-role="field"][data-name="phone"]': function () {
            this.config.$send.prop('disabled', true);
        }
    },
    init: function(config) {
        this.super_.init.call(this, config);
    },
    sendAuthCode: function () {
        var phone = this.config.$el.serializeObject().phone;
        var $send = this.config.$send;
        var $input = this.config.$field.filter('[data-name="phone"]').find('input');
        var self = this;

        if ($send.prop('disabeld') || $send.hasClass('disabled')) {
            return false;
        }

        $send
            .addClass('disabled')
            .prop('disabled', true)
            .text('发送中...');

        AccountAPI.sendAuthCode({
            phone: phone,
            getCodeType: 1
        })
            .done(function () {
                var count = 60;

                self.timer = setInterval(function () {
                    count --;
                    if (count < 0) {
                        clearInterval(self.timer);

                        self.resetSendBtn();
                        $input.prop('readonly', false);
                        return;
                    }

                    $send.text(count + '秒后重发');
                    $input.prop('readonly', true);
                }, 1000);
            })
            .fail(function (err) {
                self.resetSendBtn();
                $input.prop('readonly', false);
                Util.toast(err.message, 1500);
            });
    },
    resetSendBtn: function () {
        this.config.$send
                    .removeClass('disabled')
                    .prop('disabled', false)
                    .text('获取验证码');
    }
});