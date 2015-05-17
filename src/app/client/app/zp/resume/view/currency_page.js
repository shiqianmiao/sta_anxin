var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var template = require('../template/project/currency_package.tpl');

require('app/client/app/zp/resume/style/resume.jcss');
exports.init = function () {
    $('body').append(template({}));
    Widget.initWidgets();
};
