var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

exports.normal = Widget.define({
    events: {
        'Event::marqueeStart': 'start',
        'Event::marqueeRestart': 'restart',
        'Event::marqueePause': 'pause',
        'Event::marqueeStop': 'stop'
    },
    init: function (config) {

        this.config         = config;
        this.carouselConfig = {
            direction   : config.direction ||'up', // up, down, left, right
            loop        : config.loop || -1,      //-1为无限循环
            delay       : config.delay || 1000,
            speed       : config.speed || 1000,
            animateMode : config.animateMode|| 'linear',
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
    carousel: function (options) {
        var self = this;
        var loop = options.loop;
        
        self.timmer = setInterval(function() {
            if(self.isPause){
                return false;
            }

            if(options.loop > 0 ){
                loop --;
                if (loop < 0) {
                    return false;
                }
            }

            var $first = self.$scrollWrap.find('li:first-child');

            switch (options.direction) {
                case 'up':
                    $first.animate({
                        marginTop: -($first.height() + parseInt(options.gap, 10))
                    }, options.speed, options.animateMode, function() {
                        $(this)
                            .appendTo(self.$scrollWrap)
                            .css({marginTop: 0});
                    });
                    break;
                case 'left':
                    $first.animate({
                        marginLeft: -($first.width() + parseInt(options.gap, 10))
                    }, options.speed, options.animateMode, function() {
                        $(this)
                            .appendTo(self.$scrollWrap)
                            .css({marginLeft: 0});
                    });
                    break;
            }
        }, options.delay);
    }
});