var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var Storage = require('app/client/app/misc/greeting_card/util/storage.js');
var urlParams = require('com/mobile/page/milan/widget/urlParams.js');
var BasePage = require('app/client/app/misc/greeting_card/view/base_page.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var CardAPI = require('app/client/app/misc/greeting_card/service/greetingCard_api.js');
var gjLog = require('app/client/common/lib/log/log.js');
var previewTpl = require('../../template/preview.tpl');
var TEXT = require('../../data/text.jjson');
/*style*/
require('../../style/style.css');

var id = urlParams.getUrlParams('template_id');

exports.init = function (config) {
    var id = config.template_id;
    var defer = $.Deferred();
    var data = null;
    if (parseInt(id, 10) < 10) {
        id = '0' + id;
    }

    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '新春贺卡'
        }
    );

    if (config.isShow) {
        data = {
            hasMusic: true,
            hasRecord: true,
            recordLength: 0,
            hasEdit: 0,
            isSend: 'disabled'
        };
        defer.resolve(data);
        Storage.clear();
        Storage.set('cardMessage', $.extend({}, data, {hasRecord: false}));
    } else {
        Storage.get('cardMessage', function (data) {
            data = data || {};
            data.isSend = '';

            if (!data.hasEdit) {
                data.hasMusic = true;
                data.hasRecord = true;
            }

            defer.resolve(data);
        });
    }

    defer.done(function (data) {
        $('body')
            .removeClass('loading')
            .append(previewTpl({
                data: data,
                cardId: id,
                GREETING_TEXTS: TEXT.greeting,
                MUSIC: TEXT.music,
                isShow: config.isShow
            }));
        Widget.initWidgets();
    });
};

exports.preCard = Widget.define({
    events: {
        'click [data-role="bgPlayBtn"]' : 'playBgMusic',
        'click [data-role="playBtn"]' : 'playRecord',
        'click [data-role="sendCard"]:not(.disabled)' : 'sendCard'
    },
    init: function(config){
        this.config = config;
        this.config.$card[id-1].className = this.config.$card[id-1].className + ' active';
        this.cardMessage = {};
        var self = this;
        Storage.get('cardMessage', function (data){
            if(data){
                self.cardMessage = data;
            }
        });
        var self = this;
        if(this.config.$bgMusic){
            this.config.$el.one('touchmove', '[data-role="cardBody"]', function(){
                var bgMusic = self.config.$bgMusic[0];
                bgMusic.play();
                self.config.$bgPlayBtn.addClass('active');
            });
        }
        NativeAPI.registerHandler('back', function( params, callback){
            self.config.$bgMusic[0].pause();
            callback({preventDefault:0});
        });
        BasePage.bindJsA();
    },
    playBgMusic: function(){
        var selfConfig = this.config;
        var bgMusic = selfConfig.$bgMusic[0];
        if(bgMusic.paused){
            if(selfConfig.$recordAudio){
                selfConfig.$recordAudio[0].pause();
            }
            bgMusic.play();
            this.config.$bgPlayBtn.addClass('active');
        }else{
            bgMusic.pause();
            this.config.$bgPlayBtn.removeClass('active');
        }
    },
    playRecord: function(){
        var selfConfig = this.config;
        var recordAudio = selfConfig.$recordAudio[0];
        var bgMusic = selfConfig.$bgMusic.get(0);
        var $btn = this.config.$bgPlayBtn;
        var bgPlaying = $btn.hasClass('active');
        var recordLength = parseInt(this.config.$recordLength.text(), 10) * 1000;

        if(bgMusic){
            bgMusic.pause();
            $btn.removeClass('active');
        }
        recordAudio.play();
        setTimeout(function () {
            if (bgPlaying) {
                bgMusic.play();
                $btn.addClass('active');
            }
        }, recordLength);
    },
    sendCard : function(){
        var params = {};
        var cardId;
        var cardMessage = this.cardMessage;
        params.tplId = id;
        params.hasMusic = cardMessage.hasMusic;
        params.toWho = cardMessage.toWho;
        params.greetingArea = cardMessage.greetingArea;
        params.fromWho = cardMessage.fromWho;
        if(this.config.$recordAudio){
            params.hasRecord = true;
            params.recordUrl = cardMessage.recordUrl;
            params.recordLength = cardMessage.recordLength;
        }
        CardAPI.createGreetingCard (params, function (err, data) {

            if (err) {
                window.alert(err);
                return;
            } else {
                cardId = data;
                var imgUrl = 'http://sta.ganji.com/att/project/app/greetingcard/images/thumbnail/card_' + id + '.jpg';
                if(id === '10'){
                    imgUrl = 'http://sta.ganji.com/att/project/app/greetingcard/images/thumbnail/card_10.jpg';
                }
                NativeAPI.invoke('showShareDialog',
                    {
                        text: '你有一封贺卡还没有签收，点开拆福包，羊年有福咯！',
                        title: '你有一封贺卡还没有签收，点开拆福包，羊年有福咯！',
                        content: '‘滴滴滴’，你收到一封神秘的贺卡，是思念？是道歉？还是难以启齿的表白？赶紧点进去看看吧~~',
                        url: 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/greeting_card/view/card/show_card.js?template_id=' + id +'&isShow=0&cardId=' + cardId,
                        img: imgUrl
                    }, function (err) {
                        if (!err) {
                            Storage.clear();
                        }
                    });
                gjLog.send('100000000216000100000010');//埋点
            }
        });
    }
});

exports.initScroll = function(config) {
    var $warppers = config.$el;

    var momentum = function(distance, curY, time, maxScrollY, warpperHeight) {
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
    };

    $warppers.each(function() {
        var curEl = this;
        if (!$(this).data('hasScroll')) {
            var $ul = $(curEl).find('nav');
            var startX = 0,
                curX = 0,
                warpperHeight = $(curEl).width(),
                maxScrollX = $(curEl).width() - $(curEl).find('nav').width(),
                startTime = 0,
                startScreenX = 0,
                animating = false,
                moved = false;

            if(maxScrollX > 0) {
                maxScrollX = 0;
            }

            var scrollTo = function() {
                if (curX > 0) {
                    curX = 0;
                } else if (curX < 0 && curX < maxScrollX) {
                    curX = maxScrollX;
                }

                animating = false;
                $ul.css({
                    '-webkit-transform': 'translate3d(' + curX + 'px, 0, 0)',
                    'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    '-webkit-transition-duration': 400 + 'ms'
                });
            };



            $(curEl).find('nav')
                .on('touchstart', function(e) {
                    e.preventDefault();
                    startX = e.changedTouches[0].screenX - curX;
                    startTime = e.timeStamp;
                    moved = false;
                    startScreenX = e.changedTouches[0].screenX;
                })
                .on('touchmove', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    animating = false;
                    moved = true;

                    curX = e.changedTouches[0].screenX - startX;
                    if (curX > 0) {
                        curX = curX * 0.4;
                    } else if (curX < maxScrollX) {
                        curX = maxScrollX + (curX - maxScrollX) * 0.4;
                    }

                    $(this).css({
                        '-webkit-transform': 'translate3d(' + curX + 'px, 0, 0)',
                        '-webkit-transition-duration': '0'
                    });

                    var timeStamp = e.timeStamp;
                    if (timeStamp - startTime > 280) {
                        startTime = timeStamp;
                        startScreenX = e.changedTouches[0].screenX;
                    }
                })
                .on('touchend', function(e) {
                    var duration = e.timeStamp - startTime;
                    var distance = e.changedTouches[0].screenX - startScreenX;

                    e.preventDefault();
                    if (moved) {
                        e.stopPropagation();
                        if ($(e.target).is('.touch')) {
                            $(e.target).removeClass('touch');
                        }
                    }

                    animating = true;
                    if (curX > 0 || curX < maxScrollX) {
                        scrollTo();
                        return;
                    }

                    if (duration < 280) {
                        var newMove = momentum(distance, curX, duration, maxScrollX, warpperHeight);

                        curX = newMove.destination;
                        $(this).css({
                            '-webkit-transform': 'translate3d(' + newMove.destination + 'px, 0, 0)',
                            'transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
                            '-webkit-transition-duration': newMove.duration + 'ms'
                        });
                    }
                })
                .on('transitionend', function() {
                    if (!animating) {
                        return false;
                    }
                    animating = false;
                    scrollTo();
                });
        }
        $(this).data('hasScroll', true);
    });
};