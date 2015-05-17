var BasePage = require('../base_page.js');
var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

$.extend(exports, BasePage);

exports.changeTab = function(config) {
    $(config.$item).on('click', function(e) {
        e.preventDefault();
        var $activeEl = config.$item.filter('.active');
        var hideId = $activeEl.data('id');
        var id = $(this).data('id');

        $activeEl.removeClass('active');
        $(this).addClass('active');

        $('#' + hideId).hide();
        $('#' + id).show();
    });
};

exports.register = Widget.define({
    events: {
        'blur .js-phone'                : 'validPhone',
        'blur [name]'                   : 'validFiled',
        'focus [data-role="password"]'  : 'showPwd',
        'blur  [data-role="password"]'  : 'hidePwd',
        'click [data-role="togglePwd"]' : 'togglePwd',
        'click [data-role="refresh"]'   : function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.refreshCaptcha();
        },
        'click [data-role="getCaptcha"]': 'getCaptcha',
        'submit'                        : 'submit',
        'keyup [name="checkcode"]':'validCaptcha',
        'focus [name="checkcode"]':'validCaptcha'
    },
    init: function(config) {
        this.config = config;
        this.$el = config.$el;
        this.curTime = 0;
        this.sendTime = config.sendTime || 300;
        this.captchaError = false;
        this.checkPwdTimer = null;
        this.isSend = false;
        this.checkcode = null;
    },
    validPhone: function(e) {
        var that = this;
        if (that.captchaError) {
            return false;
        }
        var val = $(e.currentTarget).val();
        val = $.trim(val);

        if(/^1[34578]\d{9}$/.test(val)) {
            var ajax = $(e.currentTarget).data('ajax');
            $.post(ajax, {phone: val}, function(data) {
                //注册过了
                var errMsg = null;
                if(data.status - 0 === 1) {
                    that.config.$getCaptcha.prop('disabled', true);
                    that.config.$submit.prop('disabled', true);
                    errMsg = data.errMsg;
                    that.isRegister = true;
                } else {
                    that.config.$getCaptcha.prop('disabled', false);
                    that.config.$submit.prop('disabled', false);
                    that.isRegister = false;
                }
                that.showError(data.errMsg);
            }, 'json');
        }
    },
    showPwd: function(e) {
        var $target = $(e.currentTarget);

        this.checkPwdTimer = setInterval(function() {
            var value = $.trim($target.val()) + '';
            var $parents = $target.parents('.form-control');
            var $togglePwd = $parents.find('[data-role="togglePwd"]');

            if (value) {
                $togglePwd.addClass('active');
            } else {
                $togglePwd.removeClass('active');
            }
        }, 500);
    },
    hidePwd: function() {
        clearInterval(this.checkPwdTimer);
    },
    validFiled: function() {
        this.validAll();
    },
    submit: function() {
        var rs = this.validAll(true);
        if (!rs) {
            return false;
        }
    },
    validAll: function(isValidRequired) {
        if(this.isRegister) {
            return false;
        }
        var errMsg = '';
        var that = this;
        var $errEl = null;
        this.config.$el.find('[name]').each(function() {
            var $target = $(this);
            var rules = $target.data('rules');
            var value = $.trim($target.val()) + '';

            $errEl = $(this);

            if (isValidRequired && !value) {
                errMsg = rules.required[1];
                return false;
            }

            if (value) {
                // 针对密码字段做安全性验证
                if($(this).hasClass('js-password')) {
                    if(/^\d{1,8}$/.test(value)) {
                        errMsg = '密码纯数字需9-16位，且不完全相同';
                        return false;
                    }
                    if(/^\d{17,}$/.test(value)) {
                        errMsg = '密码纯数字需9-16位，且不完全相同';
                        return false;
                    }
                    if(/^(\d)\1{2,}\1$/.test(value)) {
                        errMsg = '密码纯数字需9-16位，且不完全相同';
                        return false;
                    }
                    if(/^([a-zA-Z]){1,5}$/.test(value)) {
                        errMsg = '密码纯字母需6-16位，且不完全相同';
                        return false;
                    }
                    if(/^([a-zA-Z])\1{2,}\1$/.test(value)) {
                        errMsg = '密码纯字母需6-16位，且不完全相同';
                        return false;
                    }
                    if(/^([a-zA-Z]){17,}$/.test(value)) {
                        errMsg = '密码纯字母需6-16位，且不完全相同';
                        return false;
                    }
                    if(/\s/.test(value)) {
                        errMsg = '密码需为6-16位，不含空格';
                        return false;
                    }
                }

                if (rules.length) {
                    var cnRegex = /[^\x00-\xff]/g;
                    var strLength = value.replace(cnRegex, '**').length;
                    if (strLength < rules.length[0][0] || strLength > rules.length[0][1]) {
                        errMsg = rules.length[1];
                        return false;
                    }
                }

                if (rules.regexp) {
                    var regexp = new RegExp(rules.regexp[0]);
                    var valid = !regexp.test(value);
                    if (rules.regexp[2]) {
                        valid = !valid;
                    }
                    if (valid) {
                        errMsg = rules.regexp[1];
                        return false;
                    }
                }

                if (rules.compare) {
                    var compareVal = that.$el.find('[name="password"]').val();
                    compareVal = $.trim(compareVal);
                    if (compareVal !== value) {
                        errMsg = rules.compare[1];
                        return false;
                    }
                }
            }
        });
        this.showError(errMsg);
        if (!errMsg && isValidRequired) {
            return true;
        } else {
            if($errEl && $errEl.attr('name') === 'checkcode') {
                $errEl.val('');
            }
            return false;
        }
    },
    showError: function(errMsg) {
        if (errMsg) {
            this.config.$error
                .addClass('active')
                .text(errMsg);
        } else {
            this.config.$error
                .removeClass('active');
        }

    },
    togglePwd: function(e) {
        e.preventDefault();
        clearTimeout(this.timer);
        var $target = $(e.currentTarget);
        var $parents = $target.parents('.form-control');
        var $password = $parents.find('[data-role="password"]');

        if ($password.attr('type') === 'password') {
            $password.attr('type', 'text');
            $target.text('隐藏');
        } else {
            $password.attr('type', 'password');
            $target.text('显示');
        }
    },
    refreshCaptcha: function() {
        var self = this;
        var url = this.config.$captcha.attr('src');
        this.config.$captcha.attr('src', url);
        if (self.config.$checkcode) {
            self.config.$checkcode.val('');
            self.checkcode = null;
        }
    },
    getCaptcha: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);

        var phone = this.config.$el.find('.js-phone').val();
        phone = $.trim(phone);
        var errMsg = [];
        if(!phone) {
            errMsg = ['请输入手机号'];
        } else {
            if(!/^1[34578]\d{9}$/.test(phone)) {
                errMsg = ['手机号格式错误'];
            }
        }

        if(errMsg.length) {
            this.showError(errMsg[0]);
            return false;
        }

        if (!$target.hasClass('active')) {
            return false;
        }

        
        var that = this;
        that.isSend = true;
        that.curTime = that.sendTime;

        var url = $target.data('ajax');
        //发送ajax请求
        $.post(url, {phone: phone, checkcode : that.checkcode}, function(data) {
            if(data && data.jsonError){
                that.showError(data.jsonError);
                $target
                        .prop('disabled', true)
                        .removeClass('active')
                        .text('获取确认码');
                that.config.$checkcode.prop('disabled', false);
                that.refreshCaptcha();
                that.isSend = false;
                return false;
            }
            $target
            .removeClass('active')
            .prop('disabled', true)
            .text('已发送');
            that.timer = setInterval(function() {
                $target.text(that.curTime + '秒');
                that.curTime -= 1;
                that.config.$checkcode.prop('disabled', true);
                if (that.curTime === 0) {
                    clearInterval(that.timer);
                    $target
                        .prop('disabled', true)
                        .text('重获确认码');
                    that.config.$checkcode.prop('disabled', false);
                    that.refreshCaptcha();
                    that.isSend = false;
                }
            }, 1000);
        }, 'json');
    },
    validCaptcha: function () {
        var self = this;
        var val = self.config.$checkcode.val();
        var captcha = $.trim(val);
        if (captcha.length >= 4) {
            self.checkCaptcha(captcha);
        }
    },
    checkCaptcha: function (captcha) {
        var self = this;
        if(!captcha){
            return;
        }
        $.getJSON(self.config.ajaxCode, {checkcode:captcha})
            .done(function (data) {
                if (data) {
                    if(1 === data.status){
                        self.showError(undefined);
                        self.checkcode = captcha;
                        if (!self.isSend) {
                            self.config.$submit.prop('disabled', false);
                            self.config.$getCaptcha.prop('disabled', false);
                            self.config.$getCaptcha.addClass('active');
                        }
                        self.captchaError = false;
                    }else if(0 === data.status){
                        self.captchaError = true;
                        self.config.$submit.prop('disabled', true);
                        self.config.$getCaptcha.prop('disabled', true);
                        self.config.$getCaptcha.removeClass('active');
                        self.showError('验证码输入错误！');
                    }
                }
            })
            .fail(function () {
                throw new Error('网络错误！');
            });
    }
});