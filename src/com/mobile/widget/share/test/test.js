var Share = require('com/mobile/widget/share/share.js');
var WeixinApi = require('com/mobile/lib/wxapi/wxapi2.js');

exports.share = function(config) {
    var weixin = new WeixinApi();
    weixin.ready(function (API) {
        API.registerShareEvents(config.shareObj);
    });

    return new Share({$btnEl: config.$el, shareObj: config.shareObj});
};