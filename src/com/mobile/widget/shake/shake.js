var Widget = require('com/mobile/lib/widget/widget.js');
var tip = require('com/mobile/widget/toast.js').show;

// Position variables
var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
var timer;

exports.shake = Widget.define({
    init: function(config) {
        this.config = config;

        if (!window.DeviceMotionEvent) {
            tip('您的设备不支持摇一摇', 1500);
            return;
        }

        window.addEventListener('devicemotion', function (e) {
            x1 = e.accelerationIncludingGravity.x;
            y1 = e.accelerationIncludingGravity.y;
            z1 = e.accelerationIncludingGravity.z;
        }, false);

        this.listen();
    },
    listen: function() {
        this.handleShake();
    },
    stopListening: function() {
        this.handleShake({
            stop: true
        });
    },
    handleShake: function(option) {
        var self = this;
        var config = this.config;

        if (timer !== void 0) {
            clearInterval(timer);
        }

        if (option && option.stop) {
            return;
        }

        timer = setInterval(function () {
            var change = Math.abs(x1-x2+y1-y2+z1-z2);

            if (change > config.sensitivity) {
                self.onShake ? self.onShake() : tip('Shake!', 1500);
            }

            x2 = x1;
            y2 = y1;
            z2 = z1;
        }, 150);
    }
});