var $ = require('$');
var template = require('app/client/app/xiche/pub_page/template/profile_car/add_car.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var BasePage = require('../base_page.js');

require('app/client/app/xiche/pub_page/style/style.jcss');

exports.init = function () {
    BasePage.init();

    var $body = $('body');

    $body.removeClass('loading');

    $body
        .append(template({}));

    Widget.initWidgets();

    BasePage.afterInitWidget();
};