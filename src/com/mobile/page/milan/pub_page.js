var BasePage = require('./base_page.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
$.extend(exports, BasePage);

exports.init = function () {
    BasePage.init();
};

exports.phoneAuthField = Widget.define({
    events: {
        'input [data-role="phone"]': function (e) {
            $(e.currentTarget).trigger('change');

            // 输入时不显示叹号
            this.$phoneSign.detach();
        },
        'blur [data-role="phone"]': function () {

            // blur 时正常显示叹号
            this.$phoneSign.appendTo(this.config.$phone.parent());
        },
        'click [data-role="send"]': 'sendSMS'
    },
    init: function (config) {
        var self = this;
        this.config = config;

        // 手机号字段的叹号
        this.$phoneSign = this.config.$el.find('[data-role="sign"]');

        // 联系电话字段 input
        this.$pubPhone = $('#js-pub-phone');

        this.config.$phone.closest('[data-role="field"]')
            .on('field-valid', function () {
                $(this).removeClass('show-tip');
                config.$send
                    .addClass('active')
                    .prop('disabled', false);
            })
            .on('field-error', function () {
                config.$phone.prop('readonly', false);
                self.$pubPhone.prop('readonly', false);

                config.$send
                    .removeClass('active')
                    .text('发送确认码')
                    .prop('disabled', true);
            });

        this.relate();
    },
    // 关联两处手机号
    relate: function() {
        var self = this;
        var config = this.config;

        // 联系电话input
        this.$pubPhone.change(function() {
            var curPhone = $(this).val();

            if (/^1[34578]/.test(curPhone)) {
                config.$phone.val(curPhone);
                config.$phone.trigger('change');
            }
        });

        config.$phone.change(function() {
            var curPhone = $(this).val();

            if (!/^(0\d{2,4}-)?[2-9]\d{6,7}(-\d{2,6})?$|^(?!\d+(-\d+){4,})[48]00(-?\d){7,16}$/.test(self.$pubPhone.val())) {
                self.$pubPhone.val(curPhone);
            }
        });
    },
    gotoLoginPub: function($tip, msg) {
        var self = this;
        var $phone = this.config.$phone;

        $tip.text(msg).show();

        setTimeout(function () {
            $tip.hide();
            $('[name="username"]').val($phone.val());
            $('#pub-login-tab').trigger('click');
            self.time = 0;

            setTimeout(function() {
                self.config.$send.text('发送确认码');
            }, 1000);
        }, 3000);
    },
    showError: function($tip, msg) {
        $tip.text(msg).show();

        setTimeout(function () {
            $tip.hide();
        }, 1500);

        this.config.$send
            .text('发送确认码')
            .addClass('active')
            .prop('disabled', false);

        this.config.$phone.prop('readonly', false);
        this.$pubPhone.prop('readonly', false);
    },
    startLoop: function () {
        var self = this;
        var $send = self.config.$send;

        clearInterval(this.timer);
        this.time = this.config.timeout || 300;

        $send.text(this.time + '秒');

        this.timer = setInterval(function () {
            self.time -= 1;
            $send.text(self.time + '秒');

            if (self.time <= 0) {
                clearInterval(self.timer);

                $send
                    .text('重新发送')
                    .prop('disabled', false);
                self.config.$phone.prop('readonly', false);
                self.$pubPhone.prop('readonly', false);
            }
        }, 1000);
    },
    sendSMS: function () {
        var self = this;
        var $phone = this.config.$phone;
        var $tip = this.config.$send.closest('[data-role="field"]').find('[data-role="tip"]');
        var phoneNumber = $phone.val();

        this.config.$send
            .prop('disabled', true)
            .text('发送中');

        $phone
            .prop('readonly', true);
        this.$pubPhone
            .val(phoneNumber)
            .prop('readonly', true);

        var ajaxParam = $.extend(this.config.$send.data(), {
            authPhone: phoneNumber
        });

        $.ajax({
            url: this.config.ajaxUrl,
            dataType: 'json',
            data: ajaxParam
        }).done(function (data) {
            if (data.ret === 1) {
                self.startLoop();
                $('#js-regpwd').show();

                // 启用密码校验规则
                $('#validatePwd').val(1);
            } else if (data.ret === -7) {
                self.startLoop();
                self.gotoLoginPub($tip, data.Msg);
            } else {
                self.showError($tip, data.Msg);
            }
        }).fail(function () {
            self.showError($tip, '网络异常');
        });
    }
});

exports.toggleWidget = Widget.define({
    events: {
        'click [data-role=toggle]': 'toggleClass'
    },
    init: function(config) {
        this.config = config;
    },
    toggleClass: function() {
        this.config.$toggle.toggleClass('active');
    }
});

exports.tabWidget = Widget.define({
    events: {
        'click [data-role="tab"]': 'changeTab'
    },
    init: function(config) {
        this.config = config;
    },
    changeTab: function(e) {
        var $tab = $(e.currentTarget);
        this.config.$tab.removeClass('active');
        $tab.addClass('active');

        $(this.config.$input).val($tab.data('value'));
    }
});
exports.tabWidgetWithEvent = Widget.define({
    events: {
        'click [data-role="tab"]': 'changeTab'
    },
    init: function(config) {
        this.referNode = config.referNode;
        this.config    = config;
        this.$el       = config.$el;
    },
    changeTab: function(e) {
        var $tab         = $(e.currentTarget);
        var currentValue = null;
        var lastValue    = this.$el.find('.active').data('value');
        currentValue     = $tab.data('value');
        if (currentValue === lastValue) {
            return;
        }
        this.config.$tab.removeClass('active');
        $tab.addClass('active');
        $(this.config.$input).val(currentValue);
        $(this.referNode).trigger(
            'TAB::change',
            {
                value : currentValue,
                index : $tab.data('index'),
                $tabTitle: this.config.$tab
            });
    }
});

exports.changeModule = Widget.define({
    events:{
        'TAB::change' : function (event, data) {
            this.changeTab(data.index);
        }
    },
    init: function (config) {
        this.$el       = config.$el;
        this.config    = config;
        this.wrapNodes = config.wrapNodes;
        this.changeTab();
    },
    changeTab: function (index) {
        var $wrap = $(this.wrapNodes[index || 0]);
        this.config.$module.addClass('hide');
        $wrap.removeClass('hide');
        this.config.$module.each(function() {
            var isDisabeld = false;
            if($(this).hasClass('hide')) {
                isDisabeld = true;
            }
            var id = $(this).attr('id');
            $('#'+id).find('[data-role="field"]').each(function() {
                $(this).data('isDisabeld', isDisabeld);
            });
        });
    }
});

exports.SMSAuthField = Widget.define({
    events:{
        'input [data-role="input"]': function (e) {
            $(e.currentTarget).trigger('change');
            this.$phoneSign.detach();
        },
        'click [data-role="send"]'  : function (e){
            e.preventDefault();
            this.sendSMS();
        }
    },
    init : function (config) {
        this.config = config;
        this.$input = config.$input;
        this.$send  = config.$send;
        this.$tip   = config.$tip;
        this.timmer = null;
        this.timmerCount = config.timmerCount || 300;

        this.$phoneSign  = this.config.$el.find('[data-role="sign"]');

        this.relateValid();
    },
    sendSMS : function (){
        var self   = this;
        var phoneNumber = this.phoneNumber();

        self.disableDom(self.$send).text('发送中');
        self.setReadOnly(self.$input, true).val(phoneNumber);

        var params = {
            phone: phoneNumber
        };

        this.getSMS(params, function (err) {
            if (err) {
                self.showError(err);
                self.enableDom(self.$send).text('发送确认码');
                self.setReadOnly(self.$input, false);
                return;
            }
            self.disableDom(self.$send).text('已发送');
            self.setReadOnly(self.$input, true).val(phoneNumber);
            self.loop();

        });

    },
    tick : function (count) {
        var self = this;
        self.$send.text(count + '秒');
        if (count <= 0) {
            clearInterval(this.timmer);
            this.enableDom(this.$send).text('重新发送');
            self.setReadOnly(self.$input, false);
        }
    },
    loop : function () {
        var self  = this;
        var count = self.timmerCount;
        this.timmer = setInterval(function () {
            count -= 1;
            self.tick(count);
        }, 1000);
    },
    showError : function (msg) {
        var self = this;
        this.$tip.text(msg).show();

        setTimeout(function () {
            self.$tip.hide();
        }, 1500);
    },
    setReadOnly: function ($node, tag) {
        $node
        .prop('readonly', tag);
        return $node;
    },
    disableDom: function ($node) {
        $node
            .removeClass('active')
            .prop('disabled', true);
        return $node;
    },
    enableDom: function ($node) {
        $node
            .addClass('active')
            .prop('disabled', false);
        return $node;
    },
    phoneNumber: function () {
        return this.$input.val();
    },
    getSMS : function (params, callback) {
        var ajaxParam = $.extend(this.config.$send.data(), params);
        $.ajax({
            url: this.config.ajaxUrl,
            dataType: 'json',
            data: ajaxParam,
            type:'POST'
        }).done(function (data) {
            if (data.ret === 1) {
                callback(null);
            }else if (data.msg) {
                callback(data.msg);
            }
        }).fail(function () {
            callback('网络异常');
        });
    },
    relateValid : function () {
        var self = this;
        this.$input.closest('[data-role="field"]')
            .on('field-valid', function () {
                $(this).removeClass('show-tip');
                self.enableDom(self.$send).text('发送确认码');
            })
            .on('field-error', function () {
                self.setReadOnly(self.$input, false);
                self.disableDom(self.$send).text('发送确认码');
            });
    }

});


exports.fieldSetWidget = Widget.define({

});

exports.checkIsBoundPhone = function (value, config, callback) {
    var phone = this.form.getValues().phone;

    if (!phone) {
        return callback(null);
    }

    $.ajax({
        url: '/bj_user/telverify/',
        data: {
            phone: this.form.getValues().phone,
            username: value
        },
        dataType: 'json'
    })
        .done(function (data) {
            if (data.status === 0) {
                return callback(new Error('用户名与手机号绑定的帐号不匹配'));
            }
            callback(null);
        })
        .fail(function () {
            callback(new Error('网络异常, 无法校验帐号, 请稍后再试'));
        });
};
