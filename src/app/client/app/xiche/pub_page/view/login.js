var $ = require('$');
var Form = require('com/mobile/lib/form/form.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var XicheAPI = require('../lib/xiche_api.js');
var template = require('../template/login.tpl');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

function back (back) {
    if (back === 'list') {
        Util.redirect('app/client/app/xiche/pub_page/view/order_list.js');
    } else if (back && back !== 'index') {
        Util.redirect(back);
    } else {
        Util.redirect('app/client/app/xiche/pub_page/view/index.js');
    }
}

exports.init = function (config) {
    BasePage.init();

    config.action = config.action || 'login';

    if (config.action === 'login' && NativeAPI.isSupport()) {
        NativeAPI.invoke('login', null, function (err) {
            if (err) {
                NativeAPI.invoke('alert', {
                    title: '提示',
                    message: '请登录后再试',
                    btn_text: '确定'
                }, function () {
                    back('index');
                });
            } else {
                back(config.from || config.back_url);
            }
        });

        return;
    }

    $('body')
        .removeClass('loading')
        .append(template({
            from: config.from || '',
            back_url: config.back_url,
            action: config.action || 'login'
        }));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};

exports.form = Widget.define({
    events: {
        'input [data-role="phone"]': function () {
            var $phone = this.config.$phone;
            this.form.fields.phone.validate($phone.val(), function (err) {
                if (err) {
                    $phone.trigger('field-error', err);
                } else {
                    $phone.trigger('field-valid');
                }
            });
        },
        'field-valid [data-role="phone"]': function () {
            this.config.$getAuthCodeBtn.addClass('active');
        },
        'field-error [data-role="phone"]': function () {
            this.config.$getAuthCodeBtn.removeClass('active');
        },
        'click [data-role="getAuthCodeBtn"].active': 'sendAuthCode',
        'click [data-role="submit"]': 'submit'
    },
    init: function (config) {
        this.config = config;
        this.form = new Form({
            fields: {
                phone: [
                    ['required', true, '请输入手机号码'],
                    ['format', 'phone', '请输入格式正确的手机号']
                ],
                code: [
                    ['required', true, '请输入手机验证码']
                ]
            }
        });

        this.form.getValues = function () {
            return config.$el.serializeObject();
        };
    },
    sendAuthCode: function () {
        var $btn = this.config.$getAuthCodeBtn;
        var $phone = this.config.$phone;
        var self = this;
        var type = this.config.action === 'login' ? 2 : 1;
        function lock () {
            $phone.prop('readonly', true);
            $btn.removeClass('active');
        }

        function unlock () {
            $phone.prop('readonly', false);
            $btn.addClass('active').text('获取验证码');
        }

        lock();

        $btn.text('发送中...');

        XicheAPI.sendPhoneAuthCode({
            phone: $phone.val(),
            getCodeType: type
        })
            .done(function () {
                var count = 60;

                self.timer = setInterval(function() {
                    count--;
                    if (count < 0) {
                        clearInterval(self.timer);
                        unlock();
                        return;
                    }

                    $btn.text(count + '秒后重发');
                }, 1000);
            })
            .fail(function (err) {
                Util.toast(err.message || '网络异常，请稍后再试', 1500);
                unlock();
            });
    },
    submit: function () {
        var formData = this.config.$el.serializeObject();
        var from = this.config.from;
        var backUrl = formData.back_url;
        var action = this.config.action;

        this.form.validate(formData, function (errs) {
            var defer;
            if (errs) {
                Util.toast(errs[Object.keys(errs)[0]].message, 1500);
                return;
            }

            if (action === 'bindphone') {
                defer = XicheAPI.bindPhone({
                    code: formData.code,
                    phone: formData.phone
                });
            } else {
                defer = XicheAPI.loginByPhoneAuthCode({
                    code: formData.code,
                    phone: formData.phone
                });
            }

            defer
                .done(function () {
                    back(from || backUrl);
                })
                .fail(function () {
                    Util.toast('校验码错误或已失效', 1500);
                });
        });
    }
});
