var $        = require('$');
var Widget   = require('com/mobile/lib/widget/widget.js');
var template = require('app/client/app/sm/template/share/sm_share_page.tpl');

/*style*/
require('../../style/style.css');

exports.init = function (config) {
    var $body = $('body');
    $body.removeClass('loading');
    $body.append(template({ data: config.prize_info}));
    Widget.initWidgets();
};