var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    events: {
        'touchstart': function (e) {
            this.startTime = e.timeStamp;
            this.startX = e.changedTouches[0].screenX - this.curX;
            this.startScreenX = e.changedTouches[0].screenX;
        },
        'touchmove': function (e) {
            var timeStamp = e.timeStamp;
            this.curX = e.changedTouches[0].screenX - this.startX;
            e.preventDefault();

            if (this.curX > 0) {
                this.curX = this.curX * 0.4;
            } else if (this.curX < this.maxScrollWidth) {
                this.curX = this.maxScrollWidth + (this.curX - this.maxScrollWidth) * 0.4;
            }

            this.config.$el.css({
                '-webkit-transform': 'translate3d(' + this.curX + 'px, 0, 0)',
                '-webkit-transition-duration': '0'
            });
            this.animating = false;
            if (timeStamp - this.startTime > 280) {
                this.startTime = timeStamp;
                this.startScreenX = e.changedTouches[0].screenX;
            }
        },
        'touchend': function (e) {
            var duration = e.timeStamp - this.startTime;
            var distance = e.changedTouches[0].screenX - this.startScreenX;

            if (this.animating) {
                e.preventDefault();
            }

            if (this.curX > 0 || this.curX < this.maxScrollWidth) {
                this.tailScroll();
                return;
            }

            if (duration < 280) {
                var newMove = this.momentum(distance, this.curX, duration, this.maxScrollWidth, this.width);
                this.curX = newMove.destination;
                this.animating = true;
                this.config.$el.css({
                    '-webkit-transform': 'translate3d(' + newMove.destination + 'px, 0, 0)',
                    'transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
                    '-webkit-transition-duration': newMove.duration + 'ms'
                });
            }
        },
        'transitionend': function() {
            if (!this.animating) {
                return false;
            }
            this.animating = false;
            this.tailScroll();
        }
    },
    init: function (config) {
        var defaultMaxScrollWidth;
        this.width = config.$el.width();
        defaultMaxScrollWidth = this.width  - document.documentElement.clientWidth;
        this.maxScrollWidth = config.maxScrollWidth || -1 * defaultMaxScrollWidth;
        this.config = config;
        this.curX = 0;
    },
    tailScroll: function () {
        if (this.curX > 0) {
            this.curX = 0;
        } else if (this.curX < this.maxScrollWidth) {
            this.curX = this.maxScrollWidth;
        }

        this.config.$el.css({
            '-webkit-transform': 'translate3d(' + this.curX + 'px, 0, 0)',
            '-webkit-transition-duration': '400ms'
        });
    },
    momentum: function(distance, pos, time, maxScrollX, width) {
        var speed = Math.abs(distance) / time,
            destination, duration;

        var deceleration = 8e-4;

        destination = pos + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
        duration = speed / deceleration;

        if (destination < maxScrollX) {
            destination = width ? maxScrollX - width / 2.5 * (speed / 8) : maxScrollX;
            distance = Math.abs(destination - pos);
            duration = distance / speed;
        } else if (destination > 0) {
            destination = width ? width / 2.5 * (speed / 8) : 0;
            distance = Math.abs(pos) + destination;
            duration = distance / speed;
        }
        return {
            destination: Math.round(destination),
            duration: duration
        };
    }
});