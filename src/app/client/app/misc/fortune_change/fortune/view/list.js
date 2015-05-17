var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
//var NativeAPI = require('app/client/common/lib/native/native.js');
var template = require('../template/list.tpl');

require('app/client/app/misc/fortune_change/fortune/style/fortune.css');
exports.init = function () {
    $('body').removeClass('loading').append(template());
    Widget.initWidgets();
};