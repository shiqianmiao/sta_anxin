var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var groupChatApi = require('app/client/app/group_chat/lib/group_chat_api.js');
var template = require('../template/level_personal.tpl');
var calcWidth = require('app/client/app/group_chat/lib/util.js').calcWidth;

require('app/client/app/group_chat/chat/style/group.css');

exports.init = function (config) {
    groupChatApi.ImGetImUserLevel({
        userId : config.user_id
    }, function(err, data){
        if (err && err.message === '网络异常') {
            $('body')
                .removeClass('loading')
                .addClass('offline');

            return;
        }

        var needs = [1, 28, 240, 360, 720];
        var width = calcWidth(data.activeValue, needs);

        $('body').removeClass('loading').append(template({
            data : data,
            width : width,
            showTips : config.tips
        }));

        Widget.initWidgets();
    });
};