var Widget           = require('com/mobile/lib/widget/widget.js');
var WeixinApi        = require('com/mobile/lib/wxapi/wxapi2.js');

exports.initWeixin = Widget.define({
    events: {
        'click [data-role="share"]': function (e) {
            e.preventDefault();
            this.shareDialog();
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.wxData = config.wxData;
        var weixin = new WeixinApi();
        weixin.ready(function (API) {
            self.API = API;
            API.registerShareEvents(self.wxData);
        });
    }
});