var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var myadUtil = require('../lib/myad_util.js');
var pageConfig;
var template = require('../template/extension-success.tpl');
var nativeApiSupport = NativeAPI.isSupport();
require('app/client/app/myad/style/coupons.jcss');
require('app/client/app/myad/style/touch_global.jcss');
NativeAPI.registerHandler('back', function(params, callback){
    callback(null, {preventDefault: 1});
    back();
});
NativeAPI.invoke('updateTitle', {
    text : '智能推广'
});
exports.init = function (config) {
    pageConfig = config;
    $('body').removeClass('loading').attr('class', 'balance fixed-area').append(template({
        hideTitle : nativeApiSupport
    }));
    Widget.initWidgets();
};
exports.link = Widget.define({
    events : {
        'click [data-role="back"]' : function(){
            back();
        },
        'click [data-role="linkdetail"]' : function(){
            back();
        },
        'click [data-role="linkmanage"]' : function(){
            myadUtil.redirect('app/client/app/myad/view/extension-manage.js?puid=' + pageConfig.puid);
        }
    },
    init : function(config) {
        this.config = config;
    }
});
function back(){
    if (nativeApiSupport) {
        NativeAPI.invoke('backToRootView');
    } else {
        window.location.href = 'http://3g.ganji.com/bj_user/list/';
    }
}