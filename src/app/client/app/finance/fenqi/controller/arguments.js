require('../style/style.jcss');
var template = require('../template/arguments.tpl');
var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

exports.init = function() {
    $('body')
        .removeClass('loading')
        .append(template());

    Widget.initWidgets();
};