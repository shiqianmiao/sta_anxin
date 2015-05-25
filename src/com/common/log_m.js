/**
 * Created by 陈朝阳<chenchaoyang@anxin365.com> on 15/3/2.
 */
var $ = require('zepto');
Log = exports;


window._hmt = window._hmt || [];

var config = {};

// 初始化百度统计
Log.initBdTrack = function (params) {

    !params && (params = {});

    config = params;

    var bdTrack = params.bdTrack;

    if (bdTrack && typeof(bdTrack) == "function") {
        bdTrack();
    }
    Log.initBdEventTrack();
};

Log.initBdEventTrack = function() {

    var bdEventTrack = $.extend(true, {}, config.bdEventTrack);
    if (bdEventTrack && typeof(bdEventTrack) == 'object') {
        for (var selector in bdEventTrack) {
            var trackParam = bdEventTrack[selector];
            //参数不合法跳过
            if (!trackParam || trackParam.length != 4) {
                continue;
            }
            trackParam.unshift('_trackEvent');
            var event = trackParam[2];
            var $selector = $(selector);
            //元素不存在，跳过
            if ($selector.length == 0 || event != 'click' && event != 'hover') {
                continue;
            }

            $selector.off(event + '.track').on(event + '.track', {param: trackParam} , function(e){
                var param = e.data.param;
                if ($(this).data('bd_key')) {
                    param[3] = $(this).data('bd_key');
                }
                if ($(this).data('bd_value')) {
                    param[4] = $(this).data('bd_value');
                }
                window._hmt.push(param);
            });
        }
    }
};