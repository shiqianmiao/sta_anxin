var Widget = require('com/mobile/lib/widget/widget.js');

module.exports = Widget.define({
    events: {
        'touchstart': function (e) {
            this.startTime = e.timeStamp;

            this.startY = e.changedTouches[0].screenY - this.curY;
            this.startScreenY = e.changedTouches[0].screenY;
        },
        'touchmove': function (e) {
            var timeStamp = e.timeStamp;

            e.preventDefault();
            this.curY = e.changedTouches[0].screenY - this.startY;
            this.animating = false;

            if (this.curY > 0) {
                this.curY = this.curY * 0.4;
            } else if (this.curY < this.maxScrollY) {
                this.curY = this.maxScrollY + (this.curY - this.maxScrollY) * 0.4;
            }

            this.config.$el.css({
                '-webkit-transform': 'translate3d(0,' + this.curY + 'px, 0)',
                '-webkit-transition-duration': '0'
            });

            if (timeStamp - this.startTime > 280) {
                this.startTime = timeStamp;
                this.startScreenY = e.changedTouches[0].screenY;
            }
        },
        'touchend': function (e) {
            var duration = e.timeStamp - this.startTime;
            var distance = e.changedTouches[0].screenY - this.startScreenY;

            if (this.animating) {
                e.preventDefault();
            }

            if (this.curY > 0 || this.curY < this.maxScrollY) {
                this.tailScroll();
                return;
            }

            if (duration < 280) {
                var newMove = this.momentum(distance, this.curY, duration, this.maxScrollY, this.warpperHeight);
                this.curY = newMove.destination;

                if (!newMove.destination || !newMove.duration) {
                    return;
                }
                this.config.$el.css({
                    '-webkit-transform': 'translate3d(0, ' + newMove.destination + 'px, 0)',
                    'transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
                    '-webkit-transition-duration': newMove.duration + 'ms'
                });
                this.animating = true;
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
    momentum: function(distance, curY, time, maxScrollY, warpperHeight) {
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
    },
    init: function(config) {
        this.config = config;

        this.startY = 0;
        this.curY = 0;
        this.startTime = 0;
        this.startScreenY = 0;
        this.animating = false;

        this.refresh();
    },
    refresh: function () {
        this.warpperHeight = this.config.$el.height();
        this.maxScrollY = this.config.$el.height() - this.config.$scrollWrapper.height();
        if(this.maxScrollY > 0) {
            this.maxScrollY = 0;
        }
        this.scrollTo(0);
    },
    tailScroll: function() {
        if (this.curY > 0) {
            this.curY = 0;
        } else if (this.curY < 0 && this.curY < this.maxScrollY) {
            this.curY = this.maxScrollY;
        }

        this.animating = false;
        this.config.$el.css({
            '-webkit-transform': 'translate3d(0, ' + this.curY + 'px, 0)',
            'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            '-webkit-transition-duration': 400 + 'ms'
        });
    },
    scrollTo: function (to) {
        this.curY = -1 * to;

        if (this.curY > 0) {
            this.curY = 0;
        } else if (this.curY < 0 && this.curY < this.maxScrollY) {
            this.curY = this.maxScrollY;
        }

        this.config.$el.css({
            '-webkit-transform': 'translate3d(0,' + this.curY + 'px, 0)',
            '-webkit-transition-duration': '0'
        });
    }
});