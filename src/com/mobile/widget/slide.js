var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    events: {
        'touchstart': 'stop',
        'touchend': 'loop',
        'click [data-role="prev"]': 'prev',
        'click [data-role="next"]': 'next'
    },
    init: function (config) {
        config.interval = config.interval || 1000;

        this.config = config;
        this.index = 0;
        this.total = $(config.$item).length;
        this.loop();
    },
    prev: function () {
        this.slideTo(this.index - 1, 'prev');
    },
    next: function () {
        this.slideTo(this.index + 1, 'next');
    },
    stop: function () {
        clearInterval(this.timer);
    },
    loop: function () {
        var self = this;
        clearInterval(this.timer);
        this.timer = setInterval(function () {
            self.loopFn();
        }, this.config.interval);
    },
    slideTo: function (index, direction) {
        var self = this;

        if (self.animating) {
            return;
        }

        // 越界检查
        index = index >= this.total ? 0 : index;
        index = index < 0 ? this.total - 1 : index;

        var defer = this.slideFn(index, direction);

        if (defer) {
            this.animating = true;
            defer.always(function () {

                self.index = index;
                self.animating = false;
            });
        } else {
            this.index = index;
        }
    },
    loopFn: function () {
        this.slideTo(this.index + 1, 'next');
    }
});