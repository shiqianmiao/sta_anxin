/**
 * ###微信内置浏览器 js API
 *
 * 1、分享到微信朋友圈
 * 2、分享给微信好友
 * 3、判断当前网页是否在微信内置浏览器中打开
 * 4、支持WeixinApi的错误监控
 * 5、检测应用程序是否已经安装（需要官方开通权限）
 *
 *［
    version         版本
 *  enableDebugMode debuge 模式开启
 *  ready           回调
 *  shareToTimeline
 *  shareToFriend
 *  getNetworkType
 *  closeWindow
 *  openInWeixin
 *  getInstallState
 *  showOptionMenu  :showOptionMenu,
 *  hideOptionMenu  :hideOptionMenu,
 * ］
 * @author wf@ganji.com
 */

var WeixinApi = function () {
    this.version = '2.5';
    return this;
};
/**
 * ##显示网页右上角的按钮
 */
WeixinApi.prototype.showOptionMenu = function () {
    window.WeixinJSBridge.call('showOptionMenu');
};


/**
 * ##隐藏网页右上角的按钮
 */
WeixinApi.prototype.hideOptionMenu = function () {
    window.WeixinJSBridge.call('hideOptionMenu');
};

/**
 * ##显示底部工具栏
 */
WeixinApi.prototype.showToolbar = function () {
    window.WeixinJSBridge.call('showToolbar');
};

/**
 * ##隐藏底部工具栏
 */
WeixinApi.prototype.hideToolbar = function () {
    window.WeixinJSBridge.call('hideToolbar');
};
/**
 * ##分享到朋友圈
 */
WeixinApi.prototype.shareToTimeline = function (data, callbacks) {
    callbacks = callbacks || {};
    var shareTimeline = function (theData) {
        window.WeixinJSBridge.invoke('shareTimeline', {
            'appid':theData.appId ? theData.appId : '',
            'img_url':theData.imgUrl,
            'link':theData.link,
            'desc':theData.desc,
            'title':theData.title,
            'img_width':'640',
            'img_height':'640'
        }, function (resp) {
            switch (resp.err_msg) {
                // share_timeline:cancel 用户取消
                case 'share_timeline:cancel':
                    callbacks.cancel && callbacks.cancel(resp);
                    break;
                // share_timeline:confirm 发送成功
                case 'share_timeline:confirm':
                case 'share_timeline:ok':
                    callbacks.confirm && callbacks.confirm(resp);
                    break;
                // share_timeline:fail　发送失败
                case 'share_timeline:fail':
                    break;
                default:
                    callbacks.fail && callbacks.fail(resp);
                    break;
            }
            // 无论成功失败都会执行的回调
            callbacks.all && callbacks.all(resp);
        });
    };
    window.WeixinJSBridge.on('menu:share:timeline', function (argv) {
        if (callbacks.async && callbacks.ready) {
            /* jshint ignore:start */
            window['_wx_loadedCb_'] = callbacks.dataLoaded || new Function();
            if(window['_wx_loadedCb_'].toString().indexOf('_wx_loadedCb_') > 0) {
                window['_wx_loadedCb_'] = new Function();
            }
            callbacks.dataLoaded = function (newData) {
                window['_wx_loadedCb_'](newData);
                shareTimeline(newData);
            };
            /* jshint ignore:end */
            // 然后就绪
            callbacks.ready && callbacks.ready(argv);
        } else {
            // 就绪状态
            callbacks.ready && callbacks.ready(argv);
            shareTimeline(data);
        }
    });
};
/**
 * ##分享给朋友
 */
WeixinApi.prototype.shareToFriend = function (data, callbacks) {
    callbacks = callbacks || {};
    var sendAppMessage = function (theData) {
        window.WeixinJSBridge.invoke('sendAppMessage', {
            'appid':theData.appId ? theData.appId : '',
            'img_url':theData.imgUrl,
            'link':theData.link,
            'desc':theData.desc,
            'title':theData.title,
            'img_width':'640',
            'img_height':'640'
        }, function (resp) {
            switch (resp.err_msg) {
                // send_app_msg:cancel 用户取消
                case 'send_app_msg:cancel':
                    callbacks.cancel && callbacks.cancel(resp);
                    break;
                // send_app_msg:confirm 发送成功
                case 'send_app_msg:confirm':
                case 'send_app_msg:ok':
                    callbacks.confirm && callbacks.confirm(resp);
                    break;
                // send_app_msg:fail　发送失败
                case 'send_app_msg:fail':
                    break;
                default:
                    callbacks.fail && callbacks.fail(resp);
                    break;
            }
            // 无论成功失败都会执行的回调
            callbacks.all && callbacks.all(resp);
        });
    };
    window.WeixinJSBridge.on('menu:share:appmessage', function (argv) {
        if (callbacks.async && callbacks.ready) {
            /* jshint ignore:start */
            window['_wx_loadedCb_'] = callbacks.dataLoaded || new Function();
            if(window['_wx_loadedCb_'].toString().indexOf('_wx_loadedCb_') > 0) {
                window['_wx_loadedCb_'] = new Function();
            }
            callbacks.dataLoaded = function (newData) {
                window['_wx_loadedCb_'](newData);
                sendAppMessage(newData);
            };
            /* jshint ignore:end */
            // 然后就绪
            callbacks.ready && callbacks.ready(argv);
        } else {
            // 就绪状态
            callbacks.ready && callbacks.ready(argv);
            sendAppMessage(data);
        }
    });
};

WeixinApi.prototype.ready = function (readyCallback) {
    if (readyCallback && typeof readyCallback === 'function') {
        var Api = this;
        var wxReadyFunc = function () {
            readyCallback(Api);
        };
        if (typeof window.WeixinJSBridge === 'undefined'){
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', wxReadyFunc, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', wxReadyFunc);
                document.attachEvent('onWeixinJSBridgeReady', wxReadyFunc);
            }
        }else{
            wxReadyFunc();
        }
    }
};

WeixinApi.prototype.enableDebugMode = function (callback) {
    if (callback) {
        callback();
    }
};

module.exports  = new WeixinApi();