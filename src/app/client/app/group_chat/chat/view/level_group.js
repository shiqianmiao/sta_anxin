var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
//var NativeAPI = require('app/client/common/lib/native/native.js');
var groupChatApi = require('app/client/app/group_chat/lib/group_chat_api.js');
var template = require('../template/level_group.tpl');
var calcWidth = require('app/client/app/group_chat/lib/util.js').calcWidth;

require('app/client/app/group_chat/chat/style/group.css');

exports.init = function (config) {
    groupChatApi.ImGetGroupLevel({
        groupId : config.group_id
    }, function(err, data){
        if (err && err.message === '网络异常') {
            $('body')
                .removeClass('loading')
                .addClass('offline');

            return;
        }
        
        var needs = [0, 7, 60, 90, 180];
        var width = calcWidth(data.activeDegree, needs);

        $('body').removeClass('loading').append(template({
            data : data,
            width : width
        }));

        Widget.initWidgets();
    });
};