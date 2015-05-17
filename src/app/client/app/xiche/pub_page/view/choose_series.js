var $ = require('$');
var template = require('../template/choose_series.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var MODELS = require('../data/models.jjson');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function (config) {
    BasePage.init();

    var brand = MODELS[config.brand];
    var $body = $('body');

    $body.removeClass('loading');

    if (!brand) {
        $body.addClass('nothing');
        return;
    }

    $body
        .append(template({
            brand: brand,
            params: config
        }));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};
