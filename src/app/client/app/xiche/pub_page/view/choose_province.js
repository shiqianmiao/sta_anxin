var $ = require('$');
var template = require('../template/choose_province.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var PROVINCES = require('../data/provinces.jjson');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    if (!config.province) {
        config.province = '京';
    }

    $('body')
        .removeClass('loading')
        .append(template({
            provinces: PROVINCES,
            params: config,
            query: $.param(config)
        }));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};
