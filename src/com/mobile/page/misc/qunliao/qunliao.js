var Widget = require('com/mobile/lib/widget/widget.js');
var $   = require('$');
var Log = require('com/mobile/lib/log/tracker.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
exports.audioSwitch = Widget.define({
    events: {
        'click': function  (e) {
            e.preventDefault();
            if (this.config.$el.hasClass('active')) {
                this.$audio[0].pause();
                this.config.$el.removeClass('active');
            }else {
                this.$audio[0].play();
                this.config.$el.addClass('active');
            }
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.$audio = config.$audio || config.$el.find('audio');
        $('body').one('touchstart', function () {
            self.$audio[0].play();
        });
        if (NativeAPI.isSupport()) {
            NativeAPI.registerHandler('back', function( params, callback){
                self.$audio[0].pause();
                callback({preventDefault:0});
            });
        }
    }
});
exports.messageSwitch = Widget.define({
    events: {
        'tap [data-role="switch"]': function  (e) {
            e.preventDefault();
            if (this.config.$el.hasClass('active')) {
                this.config.$el.removeClass('active');
            }else {
                this.config.$el.addClass('active');
            }
        }
    },
    init: function (config) {
        this.config = config;
    }
});
exports.unlock = Widget.define({
    events : {
        'touchmove': 'slider',
        'touchend': 'reset',
        'unlock'                        : 'unlock',
        'click [data-role="close"]'     : 'close',
        'click [data-role="download"]'  : function () {
            var self = this;
            $('#audio')[0].pause();
            if (NativeAPI.isSupport()) {
                NativeAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
                    if (!err) {
                        if (deviceInfo && deviceInfo.versionId >= '6.0.0') {
                            NativeAPI.invoke('createNativeView', {
                                name: 'groupChatMsgbox'
                            });
                            return;
                        }
                    }
                    self.download(self.config.url + '_app');
                });
            }else {
                this.download();
            }
        },
        'click [data-role="share"]'     : function (e) {
            e.preventDefault();
            var num = parseInt($('#num').text(), 10) + 1;
            document.title = window.shareData.tTitle = '打动无数在外奋斗的人——我第' + num + '个为老乡点赞！';
            if (NativeAPI.isSupport()) {
                this.shareFromNative(window.shareData);
                return;
            }
            try {
                window.WeixinJSBridge.call('showOptionMenu');
            } catch (c) {}
            $('#shareDialog')
                .addClass('active')
                .one('click', function () {
                $(this).removeClass('active');
            });
        }
    },
    init: function (config) {
        this.config   = config;
        this.$el      = config.$el;
        this.noSlider = config.noSlider || false;
        window.shareData.timeLineLink = 'http://3g.ganji.com/misc/qunliao/?ifid=h5_yunying_qunliao';
        if (!NativeAPI.isSupport() && !window.WeixinJSBridge) {
            this.config.$share.hide();
        }
    },
    slider: function (event) {
        event.preventDefault();
        if (this.noSlider) {
            return;
        }
        var el = event.currentTarget;
        var touch = event.touches[0];
        var scale = this.$el.width() - 50;
        var curX = touch.pageX - this.$el[0].offsetLeft - 73;
        if(curX <= 0) {
            return;
        }
        if (curX > 30) {
            this.config.$el[0].style.opacity = 30;
        }
        if (curX > scale) {
            curX = scale;
            this.$el.trigger('unlock');
        }
        el.style.webkitTransform = 'translateX(' + curX + 'px)';
    },
    reset : function (event) {
        var el = event.target;
        if (this.noSlider) {
            return;
        }
        el.style.webkitTransition = '-webkit-transform 0.3s ease-in';
        $(el).on( 'webkitTransitionEnd', function() { el.style.webkitTransition = 'none'; }, false );
        el.style.webkitTransform = 'translateX(0px)';
        this.config.$el[0].style.opacity = 100;
    },
    unlock : function () {
        var self = this;
        self.downLoad();
        self.close();
    },
    close : function () {
        this.$el.hide();
    },
    download: function (url) {
        var url = url || this.config.url;
        window.location.href = this.config.url;
        try{
            Log.send('wap_qunliao_download');
        }catch(e){}
    },
    shareFromNative: function (wxData) {
        NativeAPI.invoke('showShareDialog',
            {
                text: wxData.tTitle,
                content: wxData.tContent,
                url: wxData.timeLineLink,
                img: wxData.imgUrl
            }, function (err) {
                if (!err) {
                    Log.send('native_weixinShareSuccess');
                }
            });
    }
});

exports.loopQuery = Widget.define({
    events: {},
    init: function (config) {
        this.config = config;
        this.type   = config.type || 'GET';
        this.delay  = config.delay || 1;
        this.url    = config.url;
        this.pause  = true;
        this.$text  = config.$text || config.$el;
        this.timmer = 0;
        this.start();
    },
    fetch: function (param, callback) {
        var self = this;
        var param = $.extend({
            type: self.type || 'GET',
            url: self.url,
            dataType:'json'
        }, param);
        $.ajax(param).done(function (data) {
            if (data.ret < 0 ) {
                callback(data.msg);
            }else{
                callback(null, data);
            }
        }).fail(function () {
            callback('network error!');
        });
    },
    start: function () {
        this.pause = false;
        this.loop();
    },
    loop: function () {
        var self = this;
        this.timmer = setInterval(function () {
            if (self.pause) {
                return;
            }
            self.tick();
        }, this.delay * 1000);
    },
    tick: function () {
        var self = this;
        this.fetch({
        }, function (err, data) {
            if (err) {
                return;
            }
            self.$text.text(data.num);
            document.title = window.shareData.tTitle = '打动无数在外奋斗的人——我第' + (parseInt(data.num, 10) + 1) + '个为老乡点赞！';
        });
    },
    stop: function () {
        this.pause = true;
    }
});
