var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

module.exports = Widget.define({
    events: {
        'tap [data-role="start"]': function () {
            var self = this;
            var $pointer = this.config.$pointer;

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

                    if (data.jump_url) {
                        window.location.href = data.jump_url;
                        return;
                    }

                    if (parseInt(data.code, 10) === -1) {
                        self.config.$el.trigger('no-chance', data);
                        return;
                    }

                    if (parseInt(data.code, 10) === -3) {
                        self.config.$el.trigger('app-fail', data);
                        return;
                    }

                    if (!data.code) {
                        deg = (36 * (parseInt(Math.random() * 10, 10) * 2 + 1)) % 360;
                    } else {
                        deg = 36 * (((parseInt(data.code, 10) === -2 ? 4 : data.code) - 1) * 2);
                    }

                    self.config.$pointer
                        .one('webkitTransitionEnd', function () {
                            var duration = $pointer.css('-webkit-transition-duration');

                            if (parseInt(data.code, 10) === -2) {
                                self.config.$el.trigger('app-success', data);
                            } else if(parseInt(data.code, 10) === 3){
                                self.config.$el.trigger('red-packet-success', data);
                            }else if (data.code) {
                                self.config.$el.trigger('success', data);
                            } else {
                                self.config.$el.trigger('no-prize', data);
                            }
                            $pointer
                                .css('-webkit-transition-duration', '0')
                                .css('-webkit-transform', 'rotate(0deg)');

                            setTimeout(function () {
                                $pointer.css('-webkit-transition-duration', duration);
                            }, 100);
                        })
                        .css('-webkit-transform', 'rotate('+(base + deg)+'deg)');
                })
                .fail(function () {
                    self.requesting = false;
                    window.alert('网络错误！');
                });
        }
    },
    init: function  (config) {
        this.config = config;
    }
});