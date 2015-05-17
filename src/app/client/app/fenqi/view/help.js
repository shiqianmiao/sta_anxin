var $           = require('$');
var NativeAPI   = require('app/client/common/lib/native/native.js');

var tpl         = require('app/client/app/fenqi/template/help.tpl');
require('../style/style.css');

var $body       = $('body');

exports.init = function () {
    $body.removeClass('loading');
    NativeAPI.invoke('updateTitle', {'text': '常见问题'} );
    $body.append(tpl());
};
