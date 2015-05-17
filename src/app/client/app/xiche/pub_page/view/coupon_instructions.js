var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var BasePage = require('./base_page.js');

var template = require('../template/coupon_instructions.tpl');

require('../style/style.jcss');

exports.init = function () {
    BasePage.init();

    $('body')
        .removeClass('loading')
        .append(template({
            back_url: 'app/client/app/xiche/pub_page/view/coupon_list.js'
        }));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};
