var $ = require('$');
var SlideWidget = require('./slide.js');

module.exports = SlideWidget.extend({
    events: {
        'touchstart [data-role="item"]': function (e) {
            this.stop();
            this.startX = e.touches[0].clientX;
        },
        'touchend [data-role="item"]': function () {
            if (this.maxMoveDist > 10) {
                this.maxMoveDist = 0;
                this[this.direction]();
            }
            this.loop();
        },
        'touchmove [data-role="item"]': function (e) {
            var touch = e.touches[0];
            var $list = this.config.$list;
            var dist = touch.clientX - this.startX;

            if (this.animating) {
                return;
            }

            if (this.maxMoveDist < Math.abs(dist)) {
                this.maxMoveDist = Math.abs(dist);
            }

            if (Math.abs(dist) > this.width || this.maxMoveDist < 10) {
                return;
            } else {
                e.preventDefault();
            }
            $list.css($.fx.cssPrefix + 'transform', 'translate3d('+  (-1 * this.index * this.width + dist)+'px, 0, 0)');
            this.direction = dist < 0 ? 'next' : 'prev';
        }
    },
    init: function (config) {
        var self = this;
        var $item = config.$item;
        config.interval = config.interval || 1000;
        this.config = config;
        this.index = 0;
        this.total = $(config.$item).length;
        this.loop();
        this.width = this.config.$el.width();
        this.config.$list.width((this.total + 2) + '00%');
        this.translateX = 0;
        this.direction = 'next';
        this.maxMoveDist = 0;
        $item.css('width', (100 / (this.total + 2)) + '%');

        var $lastClone = $item.eq(this.total - 1).clone();
        var $firstClone = $item.eq(0).clone();
        $lastClone.css({
            'position': 'relative',
            'left': '-100%'
        });

        $([
            $item.eq(0).find('img[data-src]'),
            $firstClone.find('img[data-src]'),
            $lastClone.find('img[data-src]')
        ]).each(function () {
            var $this = $(this);
            $this.attr('src', $this.data('src'));
        });

        this.config.$list.append($firstClone).append($lastClone);

        $(window).on('resize', function () {
            self.width = self.config.$el.width();
            self.slideTo(self.index, 'next');
        });
    },
    slideFn: function (index, direction) {
        var self = this;
        var defer = $.Deferred();
        var delt = index - this.index;
        var $list = this.config.$list;
        var total = this.total;
        var width = this.config.$list.width();
        // lazy load
        $([
            this.config.$item.eq(index).find('img[data-src]'),
            this.config.$item.eq(index + 1).find('img[data-src]')
        ]).each(function () {
            var $this = $(this);
            if ($this.data('src') && $this.attr('src') !== $this.data('src')) {
                $this.attr('src', $this.data('src'));
            }
        });

        if (direction === 'prev' && delt > 0) {
            delt = delt - total;
        }

        if (direction === 'next' && delt < 0) {
            delt = delt + total;
        }
        this.animating = true;
        $list.animate({
            translate3d: -1 / (this.total + 2) * (this.index + delt) * width + 'px, 0, 0'
        }, this.config.animateTime || 200,function () {
            var x;
            if (self.index === 0 && index === total - 1 && direction === 'prev') {
                x = -1 / (self.total + 2) * (self.total - 1) * width;
                $list.css($.fx.cssPrefix + 'transform', 'translate3d(' + x + 'px, 0, 0)');
            } else if (self.index === total - 1 && index === 0 && direction === 'next') {
                $list.css($.fx.cssPrefix + 'transform', 'translate3d(0, 0, 0)');
            }
            defer.resolve();
            self.animating = false;
        });

        this.config.$el.find('[data-slide-to]')
            .removeClass('active')
            .filter('[data-slide-to="' + index + '"]')
                .addClass('active');

        this.config.$el.find('[data-role="index"]').text(index + 1);

        return defer.promise();
    }
});