var RemoteAPI = require('app/client/app/zp/lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var $ = require('$');
var template  = require('../template/report/report_page.tpl');
var Widget    = require('com/mobile/lib/widget/widget.js');
var toast     = require('app/client/app/zp/resume/widget/view/toast.js');
require('app/client/app/zp/resume/style/resume.jcss');

exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '简历举报'
        }
    );
    getInitData(function (data) {
        $('body')
            .removeClass('loading')
            .append(template(data));

        Widget.initWidgets();
    });

    function getInitData (callback) {
        var userInfoDefer = $.Deferred();
        userInfoDefer
            .done(function (userInfo) {
                callback({
                    userId: userInfo.user_id,
                    puid  : config.puid,
                    isMy  : config.is_my || false
                });
            })
            .fail(function () {
                callback({userId:null,puid : config.puid, isMy: config.is_my });
            });

        NativeAPI.invoke('getUserInfo', null, function (err, userInfo) {
            if (err) {
                userInfoDefer.reject(err);
                return;
            }
            userInfoDefer.resolve(userInfo);
        });
    }
};
exports.form = Widget.define({
    events: {
        'submit': 'submit'
    },
    init: function (config) {
        this.config        = config;
        this.contentLength = parseInt(config.contentLength, 10) || 200;
    },
    validate : function (data, callback){
        var PHONE_RE = /^1[34578]\d{9}$/;
        if (!data.reasonId) {
            return callback(new Error('请选择举报类型'));
        }
        if (!data.content) {
            return callback(new Error('请填写情况说明'));
        }

        if (data.content.length > this.contentLength) {
            return callback(new Error('情况说明不得超过'+this.contentLength+'个字'));
        }

        if (!data.phone) {
            return callback(new Error('请输入您的手机号'));
        }

        if (!PHONE_RE.test(data.phone)) {
            return callback(new Error('手机号格式不对'));
        }

        return callback(null);
    },
    submit: function (e) {
        e.preventDefault();
        var data = this.config.$el.serializeObject();
        this.validate(data, function (err) {
            if (err) {
                toast(err.message, 1500);
                return;
            }
            toast('发送中...');

            RemoteAPI.getData($.extend({
                controller:'Resume',
                action:'report'
            },data), function (err) {
                if (err) {
                    toast(err.message, 1500);
                }else{
                    toast('举报成功!', 1500);
                }
                setTimeout(function () {
                    NativeAPI.invoke('back');
                }, 1500);
            });
        });
    }
});
exports.picker = Widget.define({
    events: {
        'tap' : 'showPop',
        'change': 'changeValue'
    },
    init: function (config) {
        this.config = config;
    },
    showPop: function () {
        this.config.$el.addClass('active');
        this.config.$options.trigger('show');
    },
    changeValue: function (e, data){
        var self = this;
        if(!data || !data.value){
            return;
        }
        self.config.$title.removeClass('active');
        self.config.$value.addClass('active').text(data.text);
        self.config.$reasonId.val(data.value);
        self.config.$el.removeClass('active');
    }
});

exports.popPicker = Widget.define({
    events: {
        'show': function () {
            this.$mask.addClass('active');
        },
        'click [data-role="option"]': function (e) {
            var $option = $(e.currentTarget);
            var $select = $option.closest('[data-role="selecter"]');
            var self = this;
            self.config.$option.removeClass('active');
            $option.addClass('active');
            $select.trigger('change', {value: $option.data('value'), text: $.trim($option.text())});
            self.close();
        },
        'click [data-role="cancel"]': function (e) {
            e.preventDefault();
            this.close();
        }
    },
    init: function (config) {
        this.config = config;
        this.$mask  = $(config.maskId || '#mask');
    },
    close: function () {
        var self = this;
        self.config.$el.closest('[data-role="selecter"]').removeClass('active');
        self.$mask.removeClass('active');
    }
});
