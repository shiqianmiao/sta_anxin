var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var urlParams = require('com/mobile/page/milan/widget/urlParams.js');
var CardAPI = require('app/client/app/misc/greeting_card/service/greetingCard_api.js');
var BasePage = require('app/client/app/misc/greeting_card/view/base_page.js');
var showTpl = require('../../template/show.tpl');
var TEXT = require('../../data/text.jjson');
/*style*/
require('../../style/style.css');
exports.init = function (config) {
    var defer = $.Deferred();
    var id = config.template_id;
    if (id < 10) {
        id = '0' + id;
    }
    if (config.isShow) {
        defer.resolve({});
    } else {
        CardAPI.getCardInfo( config.cardId, function (err, data){
            defer.resolve(data || {});
        });
    }
    defer.done(function (data) {
        $('body')
            .removeClass('loading')
            .append(showTpl({
                data: data,
                GREETING_TEXTS: TEXT.greeting,
                cardId: id,
                isShow: config.isShow,
                MUSIC: TEXT.music
            }));

        BasePage.bindJsA();
        Widget.initWidgets();
    });
};

exports.showCard = Widget.define({
    events:{
        'click [data-role="bgPlayBtn"]': 'playBgMusic',
        'click [data-role="playRecordBtn"]': 'playrecordAudio',
        'click [data-role="useClient"]': 'toUseClient'
    },
    init: function (config) {
        this.config = config;
        var self = this;
        var flag = urlParams.getUrlParams('flag');
        if(this.config.$bgMusic){
            this.config.$el.one('touchstart', '[data-role="cardBody"]', function(){
                self.config.$bgPlayBtn.addClass('active');
                self.config.$bgMusic[0].play();
            });
        }
        if(window.navigator.userAgent.indexOf('Android') > -1){
            var weibo = /Weibo/i.test(window.navigator.userAgent);
            if((!!window.WeixinJSBridge || weibo) && flag === '1'){
                this.config.$weixinMask.addClass('active');
            }else if(!!!window.WeixinJSBridge && flag === '1'){
                this.getApp();
            }
        }else{
            if(flag === '1'){
                window.location.href = 'ganji://';
            }
        }
    },
    playBgMusic: function(){
        var bgMusic = $(this.config.$bgMusic).get(0);
        var record = $(this.config.$recordAudio).get(0);
        var $btn = $(this.config.$bgPlayBtn);
        if (record) {
            record.pause();
        }

        if ($btn.hasClass('active')) {
            bgMusic.pause();
            $btn.removeClass('active');
        } else {
            bgMusic.play();
            $btn.addClass('active');
        }
    },
    playrecordAudio: function(){
        var recordAudio = $(this.config.$recordAudio).get(0);
        var bgMusic = $(this.config.$bgMusic).get(0);
        var $btn = $(this.config.$bgPlayBtn);
        var isBgPlaying = $btn.hasClass('active');
        var recordLength = parseInt($(this.config.$recordLength).text() || '3', 10) * 1000;
        if (bgMusic) {
            bgMusic.pause();
            $btn.removeClass('active');
        }

        recordAudio.play();
        setTimeout(function () {
            if (isBgPlaying) {
                bgMusic.play();
                $btn.addClass('active');
            }
        }, recordLength + 500);
    },
    toUseClient: function(){
        var self = this;
        var weibo = /Weibo/i.test(window.navigator.userAgent);
        if (window.navigator.userAgent.indexOf('Android') > -1) {
            if( !!window.WeixinJSBridge || weibo){
                self.config.$weixinMask.addClass('active');
                window.location.href = window.location.href + '&flag=1';
            }else{
                self.getApp();
            }
        }else{
            if( weibo ){
                self.config.$weixinMask.addClass('active');
                window.location.href = window.location.href + '&flag=1';
            }else{
                self.getApp();
            }
        }
    },
    getApp: function(){
        var timeStart = new Date();

        if (window.location.href.indexOf('isappinstalled=0') === -1) {
            window.location.href = 'ganji://';
        }

        setTimeout(function () {
            var timeEnd = new Date();
            var time = timeEnd - timeStart;
            if(time >= 1000 && time <= 2000){
                if (/android/i.test(window.navigator.userAgent) && !window.confirm('是否下载赶集生活APP')) {
                    return;
                }

                window.location.href = 'http://wap.ganji.com/wdnow.php?ignoreUA=0&pr=1&ca_name=';
            }
        }, 1000);
    }
});