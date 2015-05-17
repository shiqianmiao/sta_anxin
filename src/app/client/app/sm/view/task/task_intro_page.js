var $        = require('$');
var Widget   = require('com/mobile/lib/widget/widget.js');
var template = require('app/client/app/sm/template/task/task_intro_page.tpl');

var SMAPI    = require('app/client/app/sm/service/sm_api.js');
var NativeAPI         = require('app/client/common/lib/native/native.js');

/*style*/
require('../../style/style.css');

exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '任务介绍'
        }
    );
    SMAPI.getTaskIntro(config.task_id, function (err, data) {
        var $body = $('body');
        if (err) {
            $body.addClass('offline');
            return;
        }
        if (!data) {
            $body.addClass('nothing');
            return;
        }
        $body.removeClass('loading');
        $body.append(template({data: data}));
        Widget.initWidgets();
    });
};