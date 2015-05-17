var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
//var NativeAPI = require('app/client/common/lib/native/native.js');
var groupChatApi = require('app/client/app/group_chat/lib/group_chat_api.js');
var template = require('../template/share.tpl');

require('app/client/app/group_chat/chat/style/group.css');

exports.init = function (config) {
    groupChatApi.ImGetGroupInfo({
        groupId : config.group_id
    }, function(err, data){
        if (err && err.message === '网络异常') {
            $('body')
                .removeClass('loading')
                .addClass('offline');

            return;
        }

        var createDate = new Date(data.createTime * 1000);
        var labels = '';

        $.each(data.labels, function(index, item){
            labels += item + ' ';
        });

        $('body').removeClass('loading').append(template({
            data : data,
            labels : labels,
            createTime : createDate.getFullYear() + '年' + (createDate.getMonth() + 1) + '月' + createDate.getDate() + '日'
        }));

        Widget.initWidgets();
    });
};

exports.main = Widget.define({
    events: {
        'click [data-role="submit"]': 'submit'
    },
    init: function(config) {
        this.config = config;
    },
    submit: function() {
        var config = this.config;
        var ua = window.navigator.userAgent;

        if (ua.match(/MicroMessenger/i)) {
            window.location.href = config.weixinAppUrl;
        } else {
            window.location.href = config.ganjiShenghuoApp;

            setTimeout(function() {
                window.location.href = config.ganjiShenghuoDownload;
            }, 1000);
        }
    }
});