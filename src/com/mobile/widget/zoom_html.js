var $ = require('$');
var _ = require('com/mobile/lib/underscore/underscore.js');
var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    init: function (config) {
        var $html = $('html');
        var orientationEvent = ('onorientationchange' in window) ? 'orientationchange' : 'resize';

        // 默认宽度（一倍宽度）
        var defaultWidth = config.defaultWidth || 320;

        // 最大放大倍数
        var maxMultiple = config.maxMultiple || 3;

        // 最小放大倍数
        var minMultiple = config.minMultiple || 1;

        var zoomPage = _.debounce(function() {
            var ratio = window.innerWidth / defaultWidth;

            if (ratio > maxMultiple) {
                ratio = maxMultiple;
            } else if (ratio < minMultiple) {
                ratio = minMultiple;
            }

            $html.css('zoom', (ratio * 100) + '%');

        }, 567);

        $(window).on(orientationEvent, zoomPage);

        // 页面加载后即适配屏幕宽度
        zoomPage();
    }
});