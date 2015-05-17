var Widget           = require('com/mobile/lib/widget/widget.js');
var NativeAPI        = require('app/client/common/lib/native/native.js');
var $                = require('$');
var WeixinApi        = require('com/mobile/lib/wxapi/wxapi2.js');

exports.weixinShare = Widget.define({
    events: {
        'click [data-role="share"]': function (e) {
            e.preventDefault();
            this.shareDialog();
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.wxData = config.wxData || {
            title: 'damon ：：微信分享测试',
            desc: '这是描述',
            link: '这是链接',
            imgUrl: '这是小图'
        };
        var weixin = new WeixinApi();
            // self.API = weixin;
        weixin.ready(function (API) {
            self.API = API;
            // API.registerShareEvents(self.wxData);
        });
    },
    isNative: function () {
        return NativeAPI.isSupport();
    },
    isWeixin: function () {
        return this.API.isSupport;
    },
    shareDialog: function () {
        // this.API.shareToTimeline(this.wxData);
        this.API.registerShareEvents(this.wxData);
        $('#my_text').html('yep');
    },
    fetch: function (param, callback) {
        var url = 'http://3g.ganji.com/misc/weixininfo/?url='+ window.location.origin + window.location.pathname +'&callback=?';
        $.getJSON(url, function(data){
            if (!data.errcode ) {
                callback(null, data);
            }else{
                callback(data.errmsg);
            }
        }).fail(function () {
            callback('network error!');
        });
    }
});