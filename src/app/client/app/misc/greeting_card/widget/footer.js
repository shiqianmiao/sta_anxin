var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var Util = require('app/client/common/lib/util/util.js');

module.exports = Widget.define({
    events: {
        'touchstart [data-role="wrapper"]': 'startScroll',
        'touchend [data-role="wrapper"]': 'stopScroll',
        'touchmove [data-role="wrapper"]': function (e) {
            var $wrapper = this.config.$wrapper;
            e.preventDefault();
            e.stopPropagation();
            this.moved = true;
            this.animating = false;

            this.curX = e.changedTouches[0].screenX - this.startX;
            if (this.curX > 0) {
                this.curX = this.curX * 0.4;
            } else if (this.curX < this.maxScrollX) {
                this.curX = this.maxScrollX + (this.curX - this.maxScrollX) * 0.4;
            }

            $wrapper.css({
                '-webkit-transform': 'translate3d(' + this.curX + 'px, 0, 0)',
                '-webkit-transition-duration': '0'
            });

            var timeStamp = e.timeStamp;
            if (timeStamp - this.startTime > 280) {
                this.startTime = timeStamp;
                this.startScreenX = e.changedTouches[0].screenX;
            }
        },
        'transitionend [data-role="wrapper"]': 'animateEnd',
        'tap [data-role="card"]': function (e) {
            Util.redirect($(e.currentTarget).data('url'));
        }
    },
    init: function (config) {
        this.config = config;
        this.startX = 0;
        this.curX = 0;
        this.warpperHeight = config.$el.width(),
        this.maxScrollX = config.$el.width() - config.$wrapper.width(),
        this.startTime = 0,
        this.startScreenX = 0,
        this.animating = false;

        if(this.maxScrollX > 0) {
            this.maxScrollX = 0;
        }
        this.curX = -1* (this.config.$card.filter('.active').offset().left || 0);
        if (this.curX) {
            this.curX += window.screen.width / 2;
        }
        this.scrollTo();
    },
    scrollTo: function () {
        if (this.curX > 0) {
            this.curX = 0;
        } else if (this.curX < 0 && this.curX < this.maxScrollX) {
            this.curX = this.maxScrollX;
        }

        this.animating = false;
        this.config.$wrapper.css({
            '-webkit-transform': 'translate3d(' + this.curX + 'px, 0, 0)',
            'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            '-webkit-transition-duration': 400 + 'ms'
        });
    },
    startScroll: function (e) {
        this.startX = e.changedTouches[0].screenX - this.curX;
        this.startTime = e.timeStamp;
        this.moved = false;
        this.startScreenX = e.changedTouches[0].screenX;
    },
    stopScroll: function (e) {
        var duration = e.timeStamp - this.startTime;
        var distance = e.changedTouches[0].screenX - this.startScreenX;
        var $wrapper = this.config.$wrapper;
        e.preventDefault();
        if (this.moved) {
            e.stopPropagation();
            if ($(e.target).is('.touch')) {
                $(e.target).removeClass('touch');
            }
        }

        this.animating = true;
        if (this.curX > 0 || this.curX < this.maxScrollX) {
            this.scrollTo();
            return;
        }

        if (duration < 280) {
            var newMove = this.momentum(distance, this.curX, duration, this.maxScrollX, this.warpperHeight);

            this.curX = newMove.destination;
            $wrapper.css({
                '-webkit-transform': 'translate3d(' + newMove.destination + 'px, 0, 0)',
                'transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
                '-webkit-transition-duration': newMove.duration + 'ms'
            });
        }
    },
    animateEnd: function () {
        if (!this.animating) {
            return false;
        }
        this.animating = false;
        this.scrollTo();
    },
    momentum: function (distance, curY, time, maxScrollY, warpperHeight) {
        var speed = Math.abs(distance) / time,
            destination, duration;

        var deceleration = 8e-4;

        destination = curY + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
        duration = speed / deceleration;

        if (destination < maxScrollY) {
            destination = warpperHeight ? maxScrollY - warpperHeight / 2.5 * (speed / 8) : maxScrollY;
            distance = Math.abs(destination - curY);
            duration = distance / speed;
        } else if (destination > 0) {
            destination = warpperHeight ? warpperHeight / 2.5 * (speed / 8) : 0;
            distance = Math.abs(curY) + destination;
            duration = distance / speed;
        }
        return {
            destination: Math.round(destination),
            duration: duration
        };
    }
});
