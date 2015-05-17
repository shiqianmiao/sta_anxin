//分享
var NativeAPI = require('app/client/common/lib/native/native.js');
var gjLog = require('app/client/common/lib/log/log.js');
if (!NativeAPI.isSupport() && window.navigator.userAgent.indexOf('MicroMessenger') === -1) {
    window.location.href = 'ganji://3g.ganji.com/protocol1/?data=' + window.encodeURIComponent('{"jump_url": "' + window.location.href + '", "open_mode": 7, "title": "天气预警"}');
}
var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var RemoteAPI = require('app/client/app/misc/weather_warning/lib/remoteAPI.js');
var template = require('../template/index.tpl');
var pageData;
var pageConfig;
var cityInfo;
require('app/client/app/misc/weather_warning/weather/style/weather_warning.css');
exports.init = function (config) {
    if (window.location.search.indexOf('isappinstalled=1') > -1) {
        config.isappinstalled = 1;
    }
    if (config.weibo) {
        gjLog.send('yujing_from_weibo');
    }
    pageConfig = config;
    NativeAPI.invoke('getCityInfo', null, function(err, result){
        if (err) {
            result = {
                city_id : config.cityId || 12
            };
        }
        cityInfo = result;
        RemoteAPI.getData(
            {
                'controller': 'CommonGetWeatherWarning',
                'cityId': result.city_id || config.cityId || 12
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
                if (data.total === 0) {
                    $('.js-nothing-tip').text('预警消息已过期');
                    $body.removeClass('loading').addClass('nothing');
                    return;
                }
                $.each(data.data, function(index, item){
                    item.warningDesc = getWarningDesc(item.warningSignalCode.desc);
                    item.warningColor = getWarningColor(item.warningSignalLevel.desc);
                    item.updateTime = getUpdateTime(item.postTime);
                });
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
    });
};
function getWarningDesc(string) {
    var desc;
    switch (string) {
        case '台风':
            desc = 'taifeng';
            break;
        case '暴雨':
            desc = 'baoyu';
            break;
        case '暴雪':
            desc = 'baoxue';
            break;
        case '寒潮':
            desc = 'hanchao';
            break;
        case '大风':
            desc = 'dafeng';
            break;
        case '沙尘暴':
            desc = 'shachenbao';
            break;
        case '高温':
            desc = 'gaowen';
            break;
        case '干旱':
            desc = 'ganhan';
            break;
        case '雷电':
            desc = 'leidian';
            break;
        case '冰雹':
            desc = 'bingbao';
            break;
        case '霜冻':
            desc = 'shuangdong';
            break;
        case '大雾':
            desc = 'dawu';
            break;
        case '霾':
            desc = 'mai';
            break;
        case '道路结冰':
            desc = 'daolujiebing';
            break;
    }
    return desc;
}
function getWarningColor(string) {
    var color;
    switch (string) {
        case '蓝色':
            color = 'blue';
            break;
        case '黄色':
            color = 'yellow';
            break;
        case '橙色':
            color = 'orange';
            break;
        case '红色':
            color = 'red';
            break;
    }
    return color;
}
function getUpdateTime(num) {
    var date = new Date(num * 1000);
    return date.getDate() + '日' + date.getHours() + '时';
}
function share() {
    var desc = '';
    var item = pageData.data[0];
    var postTime = new Date(item.postTime * 1000);
    desc += item.desc + '，发布日期：' + postTime.getFullYear() + '年' + (postTime.getMonth()+1) + '月' + postTime.getDate() + '日' + postTime.getHours() + '时' + postTime.getMinutes() + '分。';
    NativeAPI.invoke(
        'showShareDialog',
        {
            title : cityInfo.city_name + ', '  + item.warningSignalLevel.desc + item.warningSignalCode.desc + '预警',
            text : cityInfo.city_name + ', '  + item.warningSignalLevel.desc + item.warningSignalCode.desc + '预警',
            content: desc,
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