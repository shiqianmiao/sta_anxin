var BasePage = require('com/mobile/page/milan/base_page.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

exports.init = function () {
    BasePage.init();
    Widget.ready(
        [
            '[data-widget="com/mobile/page/misc/mid_autumn/index.js#turntable"]',
            '[data-widget="com/mobile/page/misc/mid_autumn/index.js#popup"]'
        ],
        function (turntable, popup) {
            turntable.config.$el.on('pop', function (e, data) {
                popup.show(data);
            });

            popup.config.$el.on('close', function () {
                turntable.reset();
            });
        }
    );
};

exports.turntable = Widget.define({
    events: {
        'tap [data-role="start"]': 'start'
    },
    init: function (config) {
        this.config = config;
    },
    start: function () {
        var self = this;

        if (self.requesting) {
            return;
        }

        self.requesting = true;

        $.ajax({
            url: this.config.ajaxUrl,
            dataType: 'json'
        })
            .done(function (data) {
                var base = 1800;
                var deg = 0;
                self.requesting = false;

                if (data.code === '-1') {
                    window.location.href = self.config.loginUrl;
                    return;
                }

                if (!data.index) {
                    deg = 22.5 + 45 * ((parseInt(Math.random() * 10, 10) % 4) * 2);
                } else {
                    deg = 22.5 + 45 * (data.index * 2 -1);
                }

                self.config.$pointer
                    .one('webkitTransitionEnd', function () {
                        self.config.$el.trigger('pop', data);
                    })
                    .css('-webkit-transform', 'rotate('+(base + deg)+'deg)');
            });
    },
    reset: function () {
        var $pointer = this.config.$pointer;
        var duration = $pointer.css('-webkit-transition-duration');
        this.requesting = false;
        this.config.$pointer
            .css('-webkit-transition-duration', '0')
            .css('-webkit-transform', 'rotate(0deg)');

        setTimeout(function () {
            $pointer.css('-webkit-transition-duration', duration);
        }, 100);
    }
});

exports.popup = Widget.define({
    events: {
        'click [data-role="close"]': 'close'
    },
    init: function (config) {
        this.config = config;
    },
    close: function () {
        this.config.$el.hide().trigger('close');
    },
    show: function (data) {
        this.config.$content.html(data.message);
        this.config.$el.show();
    }
});