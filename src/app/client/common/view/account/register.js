var Widget = require('com/mobile/lib/widget/widget.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var BaseForm = require('com/mobile/widget/form2/form.js');
var Util = require('app/client/common/lib/util/util.js');
var AccountAPI = require('./lib/api');
var $ = require('$');
var template = require('./template/register.tpl');

var httpApi = new HttpAPI({
    path: '/users/'
});

require('./style.css');

exports.init = function (config) {
    $('body')
        .removeClass('loading')
        .append(template());

    $('#form')
        .data('validations', {
            phone: {
                rules: [
                    ['required', true, '忘记填写手机号啦'],
                    ['regexp', '^1[34578]\\d{9}$', '手机号格式错误']
                ]
            },
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
            },
            authCode: {
                rules: [
                    ['required', true, '忘记填写验证码啦'],
                    ['minLength', 4, '验证码格式错误'],
                    ['maxLength', 6, '验证码格式错误']
                ]
            }
        })
        .on('register-success', function () {
            var pramsObj = config;
            var back_url = config.back_url;
            pramsObj.from = 'register';
            delete config.back_url;

            if (back_url) {
                AccountAPI.goBackUrl(back_url, pramsObj);
            }
        });

    Widget.initWidgets();
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
        'input [data-role="field"][data-name="phone"]': function () {
            this.validateField('phone');
        },
        // 表单验证正确
        'form-valid': function() {
            var formData = this.config.$el.serializeObject();
            var self = this;

            httpApi.request('POST', {'interface': 'register'}, '', {
                registerType: 1,
                phone: formData.phone,
                code: formData.authCode,
                password: formData.password
            })
                .done(function(data) {
                    Util.toast('注册成功', 1500);
                    data.phone = formData.phone;
                    AccountAPI.saveUserInfo(data);
                    self.config.$el.trigger('register-success');
                })
                .fail(function(err) {
                    Util.toast(err.message, 1500);
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
            phone: phone
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
