var Widget = require('com/mobile/lib/widget/widget.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');
var BaseForm = require('com/mobile/widget/form2/form.js');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
var AccountAPI = require('./lib/api');
var $ = require('$');

var template = require('./template/login.tpl');
require('./style.css');

var UserAPI = new HttpAPI({
    path: '/users/'
});

exports.init = function (config) {
    // 渲染页面需要带上所有参数
    var renderParams = config;
    delete renderParams.redirect;
    var back_url = $.param(renderParams) || '';

    $('body')
        .removeClass('loading')
        .append(template({
            back_url: back_url
        }));

    $('#form')
        .data('validations', {
            username: {
                rules: [
                    ['required', true, '忘记填写用户名啦'],
                    ['minLength', 4, '账号格式错误，4-20个字符'],
                    ['maxLength', 20, '账号格式错误，4-20个字符']
                ]
            },
            password: {
                rules: [
                    ['required', true, '忘记填写密码啦'],
                    ['minLength', 6, '密码格式错误，6-16个字符'],
                    ['maxLength', 16, '密码格式错误，6-16个字符']
                ]
            },
            captcha: {
                rules: [
                    ['required', true, '忘记填写验证码啦'],
                    ['minLength', 4, '验证码格式错误'],
                    ['maxLength', 6, '验证码格式错误']
                ]
            }
        })
        .on('login-success', function () {
            var pramsObj = config;
            var back_url = config.back_url;
            pramsObj.from = 'login';
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
        // 表单验证正确
        'form-valid': function() {
            var formData = this.config.$el.serializeObject();
            var self = this;

            UserAPI.request('POST', {'interface': 'userLogin'}, '', {
                loginName: formData.username,
                password: formData.password,
                captcha: formData.captcha
            })
                .done(function(data) {
                    AccountAPI.saveUserInfo(data);
                    self.config.$el.trigger('login-success');
                })
                .fail(function() {
                    Util.toast('用户名密码错误');
                });
        },
        'tap [data-role="captcha"]': 'refreshCaptcha'
    },
    init: function(config) {
        this.super_.init.call(this, config);
        this.refreshCaptcha();
    },
    refreshCaptcha: function () {
        var $img = this.config.$captcha.find('img');
        HybridAPI.invoke('getDeviceInfo', null)
            .done(function (deviceInfo) {
                var uuid = deviceInfo.userId;
                $img.attr('src', 'http://wap.ganji.com/ajax.php?module=mclient_captcha'+
                    '&dir=common&type=login&tag=phone&w=120&h=35' +
                    '&nocache=' + Date.now() +
                    '&uuid=' + uuid +
                    '&customerId=' + deviceInfo.customerId
                );
            });
    }
});
