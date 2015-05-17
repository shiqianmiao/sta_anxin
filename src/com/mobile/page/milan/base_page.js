var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');

exports.init = function () {
    exports.responseTouchState();
    Widget.initWidgets();
    require.async('com/mobile/lib/log/tracker.js', function (LogTracker) {
        LogTracker.listen();

        if (!window.cproStyleApi) {
            LogTracker.send('/uniontgm/baidu/no_ad');
        }
    });
};

exports.header = Widget.define({
    init: function (config) {
        var $el = $(config.$el);
        this.originTop = $el.offset().top;
        this.check = this.check.bind(this);

        this.listen();
    },
    fixed: function () {
        if (!this.isFixed) {
            $('body').addClass('header-fixed');
        }
        this.isFixed = true;
    },
    unfixed: function () {
        if (this.isFixed) {
            $('body').removeClass('header-fixed');
        }
        this.isFixed = false;
    },
    listen: function (dontCheck) {
        if (!dontCheck) {
            this.check();
        }

        $(window).on('scroll', this.check);
    },
    stopListening: function () {
        $(window).off('scroll', this.check);
    },
    check: function () {
        if ($(window).scrollTop() > this.originTop) {
            this.fixed();
        } else {
            this.unfixed();
        }
    }
});

exports.backToTop = function (config) {
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > window.innerHeight) {
            config.$el.show();
        } else {
            config.$el.hide();
        }
    });
    config.$el.on('click', function () {
        var currntScrollTop = $(window).scrollTop();
        var step = parseInt(currntScrollTop / 20, 10);

        setTimeout(function () {
            var i = 1;
            var timer = setInterval(function () {
                var scrollTo = currntScrollTop - i * step;
                if (scrollTo  <= 0) {
                    $(window).scrollTop(0);
                } else {
                    $(window).scrollTop(scrollTo);
                }
                i ++ ;
            }, 5);

            setTimeout(function () {
                clearInterval(timer);
                $(window).scrollTop(0);
            }, 150);
        }, 300);
    });
};

exports.responseTouchState = function () {
    $('body')
        .on('touchstart', 'a, .js-touch-state', function () {
            $(this).addClass('touch');
        })
        .on('touchmove', 'a, .js-touch-state', function () {
            $(this).removeClass('touch');
        })
        .on('touchend', 'a, .js-touch-state', function () {
            $(this).removeClass('touch');
        })
        .on('touchcancel', 'a, .js-touch-state', function () {
            $(this).removeClass('touch');
        });
};

(function () {
    var $tip = $('<div class="tip"></div>').hide().appendTo('body');
    var hideTipTimer;
    exports.tip = function (message, timeout) {
        if (message) {
            $tip.html(message).show();
        }

        if (timeout) {
            clearTimeout(hideTipTimer);
            hideTipTimer = setTimeout(function () {
                $tip.hide();
            }, timeout);
        }

        $('body').append($tip);

        return {
            setMessage: function (message, timeout) {
                $tip.html(message);
                if (timeout) {
                    clearTimeout(hideTipTimer);
                    hideTipTimer = setTimeout(function () {
                        $tip.remove();
                    }, timeout);
                }
            },
            remove: function () {
                $tip.remove();
            }
        };
    };
})();

if(window.ADSCONF) {
    require.async('app/cp/uniontgm.js', function(Uniontgm) {
        return new Uniontgm(window.ADSCONF);
    });
}