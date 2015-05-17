var $         = require('$');
var Util      = require('app/client/common/lib/util/util.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var Widget    = require('com/mobile/lib/widget/widget.js');

var gjLog     = require('app/client/common/lib/log/log.js');

exports.shareConfig = {
    title:'轻松赚积分，拿好礼，这里啥都有！土豪勿入！',
    brief:'赶集积分商城，轻轻松松赚积分，变身高富帅~',
    wapUrl: window.location.origin + window.location.pathname + '#app/client/app/sm/view/share/sm_share_page.js',
    images:'http://m.ganjistatic1.com/d502ac816aa722730ca38707bb3cf622/jifen_share.png'
};
exports.bindJsA = function (config) {
    var config = config || {};
    var $el = config.$el || $('body');
    $el.on('click', '[data-js-a]', function (e) {
        var $cur = $(e.currentTarget);

        e.preventDefault();
        e.stopPropagation();

        Util.redirect($cur.data('js-a'));
    });
};
exports.setGjch = function (str) {
    gjLog.setGjch(str);
};
exports.log = function (str) {
    gjLog.send(str);
};
exports.bindNativeA = function (config) {
    var config = config || {};
    var $el = config.$el || $('body');
    $el.on('click', '[data-native-a]', function (e) {
        var $cur = $(e.currentTarget);

        e.preventDefault();
        e.stopPropagation();

        if ($cur.data('evlog')) {
            gjLog.send($cur.data('evlog'));
        }
        NativeAPI.invoke(
            'createWebView',
            {
                url: window.location.pathname + $cur.data('native-a'),
                controls: $cur.data('controls')
            }
        );
    });
};

exports.loadMore = Widget.define({
    events: {
        'tap [data-role="loadMore"]': function() {
            this.loadMore();
        },
        'touchend [data-role="loadMore"]': function(e) {
            e.preventDefault();
        }
    },
    init: function(config) {
        var self = this;
        var windowHeight = window.screen.height;
        this.loadingText = config.loadingText || config.$el.html();
        this.config      = config;
        this.$el         = config.$el;
        this.offset      = 0;
        this.scrollAble  = config.scrollAble || false;
        this.listening   = false;
        self.pending     = false;
        this.gap         = config.gap || 100;
        function onScroll() {
            var top = $(window).scrollTop();
            if ($('#feedList').height() - windowHeight - top < self.gap) {
                self.loadMore();
            }
        }

        this.listenScroll = function() {
            if (self.listening) {
                return;
            }
            self.listening = true;
            $(window).on('touchmove', onScroll);
        };

        this.removeScrollListener = function() {
            $(window).off('scroll', onScroll);
            self.listening = false;
        };
        if (config.scrollAble) {
            self.listenScroll();
        }
    },
    loadMore: function() {
        var self = this;
        if (self.pending) {
            return;
        }
        self.removeScrollListener();
        self.config.$el.show();
        self.pending = true;
        setTimeout(function() {
            self.config.$el
                    .html(self.loadingText)
                    .hide();
        }, 1000);
    }
});