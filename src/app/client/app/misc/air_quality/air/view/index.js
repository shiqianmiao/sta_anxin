var NativeAPI = require('app/client/common/lib/native/native.js');
var gjLog = require('app/client/common/lib/log/log.js');
var nativeApiIsSupport = NativeAPI.isSupport();
if (!nativeApiIsSupport && window.navigator.userAgent.indexOf('MicroMessenger') === -1) {
    window.location.href = 'ganji://3g.ganji.com/protocol1/?data=' + window.encodeURIComponent('{"jump_url": "' + window.location.href + '", "open_mode": 7, "title": "空气质量"}');
}
var Storage = require('com/mobile/lib/storage/storage.js');
var storage = new Storage('AIR_QUALITY_REFRESH_TIME');
var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var RemoteAPI = require('app/client/app/misc/air_quality/lib/remoteAPI.js');
var iScroll = require('com/mobile/lib/iscroll/iscrollProbe.js');
var template = require('../template/index.tpl');
var pageData;
var cityInfo;
var pageIscroll;
require('app/client/app/misc/air_quality/air/style/air_quality.css');
NativeAPI.invoke('updateHeaderRightBtn',{
    action:'show',
    text: '分享',
    icon: 'share'
});
NativeAPI.invoke(
    'updateTitle',
    {
        'text': '空气质量'
    }
);
exports.init = function (config) {
    if (window.location.search.indexOf('isappinstalled=1') > -1) {
        config.isappinstalled = 1;
    }
    if (config.weibo) {
        gjLog.send('tianqi_from_weibo');
    }
    NativeAPI.invoke('getCityInfo', null, function(err, result){
        cityInfo = result;
        if (err) {
            result = {
                city_id : config.city_id
            };
        }
        getData(result);
    });
    function getData(cityInfo){
        RemoteAPI.getData(
            {
                'controller': 'CommonGetAirQuality',
                'cityId': cityInfo.city_id || 12
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
                storage.set('refreshtime', data.servertime);
                data.levels = getPmlevels(data.lastweek);
                pageData = data;
                $body
                    .removeClass('loading')
                    .append(template({
                        nativeApiIsSupport : nativeApiIsSupport,
                        data : data,
                        from : config.from,
                        env : $body.hasClass('android') ? 'android' : 'ios',
                        isappinstalled : config.isappinstalled > -1 && !NativeAPI.isSupport() ? config.isappinstalled : -1
                    }))
                    .addClass(getPmLevel(data.pm25));
                Widget.initWidgets();
                NativeAPI.registerHandler('headerRightBtnClick', share);
                NativeAPI.registerHandler('share', share);
                if (NativeAPI.isSupport()) {
                    $('.air_quality').css('height', $(window).height());
                    var iscrollOptions = {
                        bounceEasing: 'easing',
                        bounceTime: 600,
                        click: true,
                        scrollbars: true,
                        topOffset: 30,
                        probeType: 3,
                        scrollX: false,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale'
                    };
                    if (window.navigator.userAgent.indexOf('Android 2.3') < 0) {
                        iscrollOptions.fadeScrollbars = true;
                    }
                    pageIscroll = new iScroll($('.air_quality').get(0), iscrollOptions);
                    pageIscroll.on('scroll', function(){//absStartY pointY
                        var $refresh = $('#refresh');
                        if (this.distY > 80 && this.absStartY === 0 && !$refresh.hasClass('active')) {
                            $refresh.addClass('active');
                            $refresh.find('.refreshtime').text(getRefreshTip(data.servertime));
                        } else if (this.distY > 150 && $refresh.hasClass('active')) {
                            $refresh.find('.refreshtip').text('释放刷新');
                            $refresh.addClass('ending');
                        }
                    });
                    pageIscroll.on('scrollEnd', function(){
                        var $refresh = $('#refresh');
                        if ($refresh.hasClass('active') && this.distY > 150 && this.absStartY === 0) {
                            $('body').find('.air_quality').remove();
                            $('body').addClass('loading');
                            getData(cityInfo);
                        } else {
                            $refresh.removeClass('active');
                        }
                    });
                }
            }
        );
    }
};
exports.link = Widget.define({
    events : {
        'tap [data-role="link"]' : function(e){
            e.preventDefault();
            var $target = $(e.currentTarget);
            NativeAPI.invoke('createWebView', {
                url : $target.data('href'),
                control: {
                    type : 'title',
                    text : '空气质量'
                }
            });
            gjLog.send('tianqi_detail_pm25');
        }
    }
});
function getPmlevels(array) {
    var levels = [];
    $.each(array, function(index, item){
        levels.push(getPmLevel(item.aqi));
    });
    return levels;
}
function getPmLevel(num) {
    var level;
    if (num <= 50) {
        level = 'level-1';
    } else if (50 < num && num <= 100){
        level = 'level-2';
    } else if (100 < num && num <= 150){
        level = 'level-3';
    } else if (150 < num && num <= 200){
        level = 'level-4';
    } else if (200 < num && num <= 300){
        level = 'level-5';
    } else {
        level = 'level-6';
    }
    return level;
}
function share() {
    NativeAPI.invoke(
        'showShareDialog',
        {
            title : cityInfo.city_name + ',空气污染指数' + pageData.pm25,
            text : cityInfo.city_name + ',空气污染指数' + pageData.pm25,
            content: '空气' + pageData.desc.level + ', ' + pageData.desc.tip,
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
function getRefreshTip(servertime){
    var now = new Date();
    var text;
    var serverDate = new Date(servertime * 1000);
    if (storage.get('refreshtime')) {
        text = '上次刷新：';
        var time = now - serverDate;
        var hour = window.parseInt(time / 3600000) ? window.parseInt(time / 3600000) : 0;
        var minute = window.parseInt(time / 60000) ? window.parseInt(time / 60000) : 0;
        if (hour > 0) {
            if (hour < 24) {
                text += hour + '小时前';
            } else {
                text += '刚刚';
            }
        } else if (minute > 0) {
            text += minute + '分钟前';
        } else {
            text += '刚刚';
        }
    } else {
        text = (serverDate.getMonth()+1) + '月' + serverDate.getDate() + '日' + serverDate.getHours() + '时' + serverDate.getMinutes() + '分';
    }
    storage.set('refreshtime', servertime);
    return text;
}