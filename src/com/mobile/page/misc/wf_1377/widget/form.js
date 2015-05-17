var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

module.exports = Widget.define({
    events: {
        'field-valid [data-role="field"][data-name="phone"]': 'checkPhoneStatus',
        'field-valid [data-role="field"]': function (e) {
            var $field = $(e.currentTarget);

            $field.find('[data-role="tip"]')
                .removeClass('active');
        },
        'field-error [data-role="field"]': function (e, error) {
            var $field = $(e.currentTarget);

            $field.find('[data-role="tip"]')
                .addClass('active')
                .text(error.message);
        },
        'error [data-role="form"]': function (e, errors) {
            var $fields = this.config.$field;
            Object.keys(errors).forEach(function (field) {
                var error = errors[field];
                var $tip = $fields.filter('[data-name="' + field + '"]').find('[data-role="tip"]');
                $tip.addClass('active').text(error.message);
            });
        },
        'tap [data-role="send"]': 'sendAuthCode',
        'tap [data-role="checkCode"]': 'refreshCheckCode'
    },
    init: function (config) {
        this.config = config;
    },
    checkPhoneStatus: function () {
        var phone = this.config.$phone.val();
        var self = this;
        var $authcodeField = this.config.$field.filter('[data-name="code"]');
        $.ajax({
            url: this.config.checkPhoneUrl,
            data: {
                phone: phone
            },
            type: 'POST',
            dataType: 'json'
        })
            .done(function (data) {
                if (phone === self.config.$phone.val()) {
                    switch(parseInt(data.status, 10)) {
                        case 0:
                            self.config.$formTip.addClass('active').text('该手机号未注册, 请进行密码设定及后续操作');
                            self.config.$form.attr('action', self.config.submitRegUrl);
                            self.refreshCheckCode(self.config.checkcodeRegUrl);
                            $authcodeField.show();
                            break;
                        case 1:
                            self.config.$formTip.addClass('active').text('该手机号已注册, 请直接输入密码登录即可');
                            self.config.$form.attr('action', self.config.submitLoginUrl);
                            self.refreshCheckCode(self.config.checkcodeLoginUrl);
                            $authcodeField.hide();
                            break;
                        default:
                            self.config.$formTip.addClass('active').text('手机号码格式不正确');
                            $authcodeField.hide();
                    }
                } else {
                    self.config.$formTip.removeClass('active');
                    $authcodeField.hide();
                }
            });
    },
    sendAuthCode: function () {
        var form = this.config.$form.serializeObject();
        var self = this;
        var $send = this.config.$send;
        var $phone = this.config.$phone;
        var timeout = this.config.sendAuthcodeTimeout || 300;
        $.ajax({
            url: this.config.sendAuthcodeUrl,
            data: {
                phone: form.phone,
                checkcode: form.checkcode
            },
            type: 'POST',
            dataType: 'json'
        })
            .done(function (data) {
                if (data && data.jsonError) {
                    $phone.attr('readonly', null);
                    self.config.$field
                        .filter('[data-name="code"]')
                            .find('[data-role="tip"]')
                                .addClass('active')
                                .text(data.jsonError);
                } else {
                    $send.addClass('disabled');
                    $phone.attr('readonly', true);
                    self.sendTimer = setInterval(function () {
                        timeout --;
                        $send.text( timeout + '秒后获取');
                        if (timeout <= 0) {
                            $send.removeClass('disabled').text('发送确认码');
                            $phone.attr('readonly', null);
                        }
                    }, 1000);
                }
            });
    },
    refreshCheckCode: function (url) {
        var $img = this.config.$checkCode.find('img');
        if (typeof url === 'string') {
            $img.attr('src', url + Date.now());
        } else {
            $img.attr('src', $img.attr('src').replace(/nocache=.*$/, 'nocache=' + Date.now()));
        }
    }
});