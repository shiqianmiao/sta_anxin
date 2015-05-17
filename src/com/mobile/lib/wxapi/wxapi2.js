/*
* debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
* appId: '', // 必填，公众号的唯一标识
* timestamp: , // 必填，生成签名的时间戳
* nonceStr: '', // 必填，生成签名的随机串
* signature: '',// 必填，签名，见附录1
* jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
*/

var wx = require('./wx_js_sdk.js');
var $  = require('$');
var originConfig = {
        debug: false,
        appId: 'wxd8345775d8fffe53',
        timestamp: 1421208864,
        nonceStr: 'xx',
        signature: 'xx',
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    };

var WeixinApi = function  () {
    this.isSupport = !!window.WeixinJSBridge;
    return this;
};

WeixinApi.prototype.registerShareEvents = function (configData) {
    this.shareToTimeline(configData);
    this.shareToFriend(configData);
    this.shareQQ(configData);
    this.shareWeibo(configData);
};

WeixinApi.prototype.ready = function (callback) {
    var api = this;
    this.fetch(function (error, data) {
        if (error && originConfig.debug) {
            window.alert(error);
            return;
        }
        wx.config($.extend(originConfig, data));
        if (originConfig.debug) {
            wx.error(function (res) {
                window.alert(res.errMsg);
            });
        }
        if (typeof callback === 'function') {
            wx.ready(function () {
                callback(api);
            });
        }else{
            callback(api);
        }
    });
};

WeixinApi.prototype.checkJsApi = function (applist, callback) {
    wx.checkJsApi({
        jsApiList: applist,
        success: function (res) {
            callback && callback(res);
        }
    });
};

WeixinApi.prototype.shareToFriend = function (data, hanlers) {
    wx.onMenuShareAppMessage({
        title: data.title,
        desc: data.desc,
        link: data.link,
        imgUrl: data.imgUrl,
        trigger: function (res) {
            hanlers && hanlers.trigger && hanlers.trigger(res);
        },
        success: function (res) {
            hanlers && hanlers.success && hanlers.success(res);
        },
        cancel: function (res) {
            hanlers && hanlers.cancel && hanlers.cancel(res);
        },
        fail: function (res) {
            hanlers && hanlers.fail && hanlers.fail(res);
        }
    });
};
WeixinApi.prototype.shareToTimeline = function (data, hanlers) {
    wx.onMenuShareTimeline({
        title: data.title,
        desc: data.desc,
        link: data.link,
        imgUrl: data.imgUrl,
        trigger: function (res) {
            hanlers && hanlers.trigger && hanlers.trigger(res);
        },
        success: function (res) {
            hanlers && hanlers.success && hanlers.success(res);
        },
        cancel: function (res) {
            hanlers && hanlers.cancel && hanlers.cancel(res);
        },
        fail: function (res) {
            hanlers && hanlers.fail && hanlers.fail(res);
        }
    });
};
WeixinApi.prototype.shareWeibo = function (data, hanlers) {
    wx.onMenuShareWeibo({
        title: data.title,
        desc: data.desc,
        link: data.link,
        imgUrl: data.imgUrl,
        trigger: function (res) {
            hanlers && hanlers.trigger && hanlers.trigger(res);
        },
        success: function (res) {
            hanlers && hanlers.success && hanlers.success(res);
        },
        cancel: function (res) {
            hanlers && hanlers.cancel && hanlers.cancel(res);
        },
        fail: function (res) {
            hanlers && hanlers.fail && hanlers.fail(res);
        }
    });
};
WeixinApi.prototype.shareQQ = function (data, hanlers) {
    wx.onMenuShareQQ({
        title: data.title,
        desc: data.desc,
        link: data.link,
        imgUrl: data.imgUrl,
        trigger: function (res) {
            hanlers && hanlers.trigger && hanlers.trigger(res);
        },
        success: function (res) {
            hanlers && hanlers.success && hanlers.success(res);
        },
        cancel: function (res) {
            hanlers && hanlers.cancel && hanlers.cancel(res);
        },
        fail: function (res) {
            hanlers && hanlers.fail && hanlers.fail(res);
        }
    });
};
WeixinApi.prototype.fetch = function (callback) {
    var href = window.location.origin + window.location.pathname + window.location.search;
    var url = 'http://3g.ganji.com/misc/weixininfo/?url='+ encodeURIComponent(href) +'&callback=?';
    $.getJSON(url, function(data){
        if (!data.errcode ) {
            callback(null, data);
        }else{
            callback(data.errmsg);
        }
    }).fail(function () {
        callback('network error!');
    });
};
module.exports = WeixinApi;

