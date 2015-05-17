var NativeAPI = require('app/client/common/lib/native/native.js');
var util = require('app/client/common/lib/util/util.js');
var nativeApiSupport = NativeAPI.isSupport();

//兼容弹窗
exports.alert = function (message){
    if (nativeApiSupport) {
        NativeAPI.invoke('alert', {
            title : '提示',
            message : message,
            btn_text : '确定'
        });
    } else {
        window.alert(message);
    }
};
exports.redirect = function (url){
    if (nativeApiSupport) {
        url = 'http://sta.ganji.com/ng/app/client/common/index.html#' + url;
        NativeAPI.invoke('createWebView', {
            url : url
        });
    } else {
        util.redirect(url);
    }
};