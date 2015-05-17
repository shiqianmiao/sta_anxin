var NativeAPI = require('app/client/common/lib/native/native.js');
var gjLog = require('app/client/common/lib/log/log.js');
if (!NativeAPI.isSupport() && window.navigator.userAgent.indexOf('MicroMessenger') === -1) {
    window.location.href = 'ganji://3g.ganji.com/protocol1/?data=' + window.encodeURIComponent('{"jump_url": "' + window.location.href + '", "open_mode": 7, "title": "今日运势"}');
}
var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var RemoteAPI = require('app/client/app/misc/fortune_change/lib/remoteAPI.js');
var template = require('../template/index.tpl');
require('app/client/app/misc/fortune_change/fortune/style/fortune.css');
var pageData;
var pageConfig = {};
exports.init = function (config) {
    if (window.location.search.indexOf('isappinstalled=1') > -1) {
        config.isappinstalled = 1;
    }
    if (config.weibo) {
        gjLog.send('xingzuo_from_weibo');
    }
    pageConfig = config;
    RemoteAPI.getData(
        {
            'controller': 'CommonGetConstellation',
            'constellationId': config.constellationId
        },
        function (err, data) {
            var $body = $('body');
            if (err) {
                if (err.message === '网络异常') {
                    $body.removeClass('loading').addClass('offline');
                } else {
                    $body.removeClass('loading').addClass('nothing');
                }
                return;
            }
            data.pName = getPname(data.name);
            pageData = data;
            $body
                .removeClass('loading')
                .append(template({
                    data : data,
                    from : config.from,
                    env : $body.hasClass('android') ? 'android' : 'ios',
                    isappinstalled : config.isappinstalled > -1 && !NativeAPI.isSupport() ? config.isappinstalled : -1
                }));
            Widget.initWidgets();
            NativeAPI.registerHandler('share', share);
        }
    );
};
exports.tab = Widget.define({
    events : {
        'click [data-role=link]' : function(){
            NativeAPI.invoke('createNativeView', {
                name : 'constellation'
            });
        }
    }
});
exports.link = Widget.define({
    events : {
        'click [data-role="link"]' : function(e){
            var $target = $(e.currentTarget);
            NativeAPI.invoke('createWebView', {
                url : $target.data('href'),
                control: {
                    type : 'title',
                    text : '星座运势'
                }
            });
            gjLog.send('tianqi_detail_dibuxingba');
        }
    }
});
function share() {
    NativeAPI.invoke(
        'showShareDialog',
        {
            text : pageData.name + '座今日运势指数',
            title : pageData.name + '座今日运势指数',
            content: '心情指数' + pageData.mood.score + '，爱情指数' + pageData.love.score + '，财运指数' + pageData.wealth.score + '，工作指数' + pageData.work.score + '，健康指数' + pageData.health.score,
            url: window.location.href,
            captureScreen : true
        },
        function (err) {
            if (err) {
                window.alert(err.message);
                return;
            }
        }
    );
}
function getPname(string) {
    var pName;
    if (string === '白羊') {
        pName = 'baiyang';
    } else if (string === '金牛'){
        pName = 'jinniu';
    } else if (string === '双子') {
        pName = 'shuangzi';
    } else if (string === '巨蟹') {
        pName = 'juxie';
    } else if (string === '狮子') {
        pName = 'shizi';
    } else if (string === '处女') {
        pName = 'chunv';
    } else if (string === '天秤') {
        pName = 'tiancheng';
    } else if (string === '天蝎') {
        pName = 'tianxie';
    } else if (string === '射手') {
        pName = 'sheshou';
    } else if (string === '魔羯') {
        pName = 'mojie';
    } else if (string === '水瓶') {
        pName = 'shuiping';
    } else if (string === '双鱼') {
        pName = 'shuangyu';
    }
    return pName;
}
exports.update = function(){
    window.location.reload();
};