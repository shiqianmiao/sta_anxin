var $ = require('$');
var template = require('../template/choose_color.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var colors = require('app/client/app/xiche/pub_page/data/colors.jjson');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    $('body')
        .removeClass('loading')
        .append(template({
            colors: colors,
            params: config
        }));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};
