var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

var template = require('../template/red_packet_instructions.tpl');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function () {
    BasePage.init();

    $('body')
        .removeClass('loading')
        .append(template({
            back_url: 'app/client/app/xiche/pub_page/view/red_packet_list.js'
        }));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};
