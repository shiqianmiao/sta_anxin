var RemoteAPI = require('app/client/app/zp/lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var $ = require('$');
var template = require('../template/invitation/invitation_page.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');

require('app/client/app/zp/resume/style/resume.jcss');

function alert (msg) {
    NativeAPI.invoke('alert', {
        title: '赶集网',
        message: msg,
        btn_text: '确定'
    });
}

var toast = (function () {
    var $tip = $('<div class="toast"></div>').hide().appendTo('body');
    var hideTipTimer;
    return function (message, timeout) {
        if (message) {
            $tip.html('<span>' + message + '</span>').show();
        }

        if (timeout) {
            clearTimeout(hideTipTimer);
            hideTipTimer = setTimeout(function () {
                $tip.hide();
            }, timeout);
        }

        $('body').append($tip);

        return {
            setMessage: function (message, timeout) {
                $tip.html('<span>' + message + '</span>');
                if (timeout) {
                    clearTimeout(hideTipTimer);
                    hideTipTimer = setTimeout(function () {
                        $tip.remove();
                    }, timeout);
                }
            },
            remove: function () {
                $tip.remove();
            }
        };
    };
})();

exports.init = function (config) {
    NativeAPI.invoke('updateTitle',{
        text: '面试邀请'
    });
    getInitData(function (err, data) {
        if (err) {
            $('body')
                .removeClass('loading')
                .addClass('offline');
            return;
        }

        $('body')
            .removeClass('loading')
            .append(template(data));

        Widget.ready(['#form'], function (form) {
            $('#submit').on('click', function () {
                form.submit();
            });
        });

        Widget.initWidgets();
    });

    function getInitData (callback) {
        var userInfoDefer = $.Deferred();

        userInfoDefer
            .done(function (userInfo) {
                RemoteAPI.getData({
                    controller: 'Resume',
                    action: 'showInterview',
                    user_id: userInfo.user_id,
                    puid: config.puid
                }, function (err, data) {
                    if (err) {
                        return callback(err);
                    }

                    data.userId = userInfo.user_id;
                    data.puid = config.puid;
                    callback(err, data);
                });
            })
            .fail(function (err) {
                callback(err);
            });

        NativeAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (err) {
                if (Math.abs(err.code) !== 32001) {
                    userInfoDefer.reject(err);
                } else {
                    NativeAPI.invoke('login', null, function (err) {
                        if (err) {
                            userInfoDefer.reject(err);
                        } else {
                            NativeAPI.invoke('getUserInfo', null, function (err, userInfo) {
                                if (err) {
                                    userInfoDefer.reject(err);
                                } else {
                                    userInfoDefer.resolve(userInfo);
                                }
                            });
                        }
                    });
                }

                return;
            }
            userInfoDefer.resolve(userInfo);
        });
    }
};

exports.form = Widget.define({
    events: {
        'tap [data-index]': function (e) {
            var $this = $(e.currentTarget);
            var text = this.config.templates[$this.data('index')] || '';

            $this
                .addClass('active')
                .siblings()
                    .removeClass('active');
            this.config.$text.val(text);
            this.updateCount();
            this.config.$index.val($this.data('index'));
            this.lastText = text;
        },
        'tap [data-role="save"]': 'saveTemplate',
        'tap [data-role="submit"]': 'submit',
        'input [data-role="text"]': function (e) {
            var text = this.config.$text.val();
            if (text.length > 130) {
                toast('面试通知不得超过130个字', 1000);
                e.preventDefault();
                this.config.$text.val(this.lastText);
            } else {
                this.lastText = text;
            }
            this.updateCount();
        },
        'tap [data-role="switch"]': function () {
            if (this.config.$switch.find('input').is('[disabled]')) {
                toast('您的短信还剩0条，不能发送短信', 1500);
            }
        }
    },
    init: function (config) {
        this.config = config;
        this.config.maxLengthPerSMS = config.maxLengthPerSMS || 65;
        this.updateCount();
        this.lastText = config.$text.val();
    },

    // user_id:用户id 必选
    // check_tmp_num: 修改几个模板 （选择范围 0,1,2） （必选）
    // text ： 模板内容，不能超过 130个字（必选,不能出现敏感词）
    // puid : 求职帖子id 必选
    // major_name ： 职位名称，不能超过20个字（必选）
    // send_sms ： 是否发送短信 选择范围 0or1 0,发生，1不发送
    // wanted_puid ：招聘帖子id （可选）能有的情况下最好带上
    submit: function () {
        var data = this.config.$el.serializeObject();

        data.send_sms = data.send_sms ? 1 : 0;

        this.validate(data, function (err) {
            if (err) {
                toast(err.message, 1500);
                return;
            }

            toast('发送中...', 1500);

            RemoteAPI.getData($.extend({
                controller: 'Resume',
                action: 'sendInterview'
            }, data), function (err, data) {
                if (err) {
                    toast(err.message, 1500);
                } else {
                    toast(data.msg || '发送成功!', 1500);
                    setTimeout(function () {
                        NativeAPI.invoke('back');
                    }, 1500);
                }
            });
        });
    },
    saveTemplate: function () {
        var index = this.config.$el.find('[data-index].active').data('index');
        var text = this.config.$text.val();
        var $save = this.config.$save;
        var self = this;
        if (!text) {
            toast('请输入面试通知', 1500);
            return;
        }

        if (text.length > 130) {
            toast('面试通知不得超过130个字');
        }

        if ($save.hasClass('loading') || $save.hasClass('saved')) {
            return;
        }

        $save.addClass('loading');
        toast('保存中...', 1500);

        RemoteAPI.getData({
            controller: 'Resume',
            action: 'saveTemplate',
            user_id: this.config.userId,
            check_tmp_num: index,
            text: text
        }, function (err, data) {
            $save.removeClass('loading');
            if (err) {
                alert(err.message);
                return;
            }
            toast(data.msg || '保存成功', 1500);
            self.config.templates[index] = text;
        });
    },
    updateCount: function () {
        var length = this.config.$text.val().length;
        this.config.$textCount.text(length);
        this.config.$msgCount.text(Math.ceil(length / this.config.maxLengthPerSMS));
    },
    // user_id:用户id 必选
    // check_tmp_num: 修改几个模板 （选择范围 0,1,2） （必选）
    // text ： 模板内容，不能超过 130个字（必选,不能出现敏感词）
    // puid : 求职帖子id 必选
    // major_name ： 职位名称，不能超过20个字（必选）
    // send_sms ： 是否发送短信 选择范围 0or1 0,发生，1不发送
    // wanted_puid ：招聘帖子id （可选）能有的情况下最好带上
    validate: function (data, callback) {
        if (!data.text) {
            return callback(new Error('请输入面试通知!'));
        }

        if (data.text.length > 130) {
            return callback(new Error('面试通知不得超过130个字'));
        }

        if (!data.major_name) {
            return callback(new Error('请输入职位名称'));
        }

        if (data.major_name.length > 20) {
            return callback(new Error('职位名称不得超过20个字'));
        }

        if (data.send_sms && Math.ceil(data.text.length / this.config.maxLengthPerSMS) > this.config.smsCount) {
            return callback(new Error('您的剩余短信条数不足'));
        }

        return callback(null);
    }
});