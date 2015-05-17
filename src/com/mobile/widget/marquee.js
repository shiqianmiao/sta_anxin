var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    events: {
        'marquee::start': 'start',
        'marquee::restart': 'restart',
        'marquee::pause': 'pause',
        'marquee::stop': 'stop'
    },
    init: function (config) {
        this.config         = config;
        this.carouselConfig = {
            direction   : (config.direction ||'Y').toLowerCase(), //x 横向滚动
            loop        : config.loop  || -1,      //-1为无限循环
            delay       : config.delay || 2,
            speed       : config.speed || 1,
            animateMode : config.animateMode|| 'linear',
            itemName    : config.itemName,
            gap         : config.gap || 8 // li的间距
        };
        this.isPause        = config.isPause || false;
        this.$scrollWrap    = config.$scrollWrap || config.$el.find('ul');
        this.timmer         = 0;
        this.start();
    },
    start: function () {
        this.carousel(this.carouselConfig);
    },
    restart: function () {
        this.isPause = false;
    },
    pause: function () {
        this.isPause = true;
    },
    stop: function () {
        this.isPause = true;
        this.timmer  = 0;
    },
    carousel: function (config) {
        var self = this;
        var loop = config.loop;
        self.timmer = setInterval(function() {
            if(self.isPause){
                return false;
            }
            if(config.loop > 0 ){
                loop --;
                if (loop < 0) {
                    return false;
                }
            }
            var $first = self.$scrollWrap.find((config.itemName || 'li') + ':first-child');
            $first.animate(self.cssParam(config, $first),
            config.speed * 1000,
            config.animateMode,
            function() {
                $(this).
                    appendTo(self.$scrollWrap)
                    .css(self.cssParam(config));
            });
        }, config.delay * 1000);
    },
    cssParam: function (config, $first) {
        var css = {};
        if (config.direction === 'y') {
            css = {'marginTop': $first ? -($first.height() + parseInt(config.gap, 10)) : parseInt(config.gap, 10)};
        }else{
            css = {'marginLeft': $first ? -($first.width() + parseInt(config.gap, 10)) : parseInt(config.gap, 10)};
        }
        /*if (config.direction === 'y'){
            css = {'-webkit-transform': 'translate3d(0, -'+ ($first.height() + parseInt(config.gap, 10)) + ', 0)'};
        }else{
            css = {'-webkit-transform': 'translate3d(-'+ ($first.width() + parseInt(config.gap, 10)) + ',0 , 0)'};
        }*/
        return css;
    }
});