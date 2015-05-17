var $ = require('$');
var Util = require('app/client/common/lib/util/util.js');
var Widget = require('com/mobile/lib/widget/widget.js');
var Storage = require('app/client/app/misc/greeting_card/util/storage.js');
var BasePage = require('app/client/app/misc/greeting_card/view/base_page.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var gjLog = require('app/client/common/lib/log/log.js');
var CardAPI = require('app/client/app/misc/greeting_card/service/greetingCard_api.js');
var editTpl = require('app/client/app/misc/greeting_card/template/edit.tpl');
var TEXT = require('../../data/text.jjson');
var TITLE_TEXT = '你有一封贺卡还没有签收，点开拆福包，羊年有福咯！';
/*style*/
require('../../style/style.css');


exports.init = function (config) {
    var id = config.template_id;

    if (id < 10) {
        id = '0' + id;
    }

    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '新春贺卡'
        }
    );

    Storage.get('cardMessage', function (data){
        $('body')
            .removeClass('loading')
            .append(editTpl({
                data: data || {},
                id: config.template_id,
                cardId: id,
                GREETING_TEXTS: TEXT.greeting,
                MUSIC: TEXT.music
            }));
        Widget.initWidgets();
    });
};

exports.editCard = Widget.define({
    events:{
        'click [data-role="closeBgMusic"]' : 'closeBgMusic',
        'click [data-role="clearToWho"]' : 'clearToWho',
        'click [data-role="clearGreetingArea"]' : 'clearGreetingArea',
        'click [data-role="clearFromWho"]' : 'clearFromWho',
        'blur [data-role="clearToWho"]' : 'getToWho',
        'blur [data-role="clearGreetingArea"]' : 'getGreetingArea',
        'blur [data-role="clearFromWho"]' : 'getFromWho',
        'click [data-role="playRecordingBtn"]' : 'showRecordingArea',
        'click [data-role="closeRecording"]' : 'closeRecoringMask',
		'tap [data-role="bgPlayBtn"]': 'toggleBgMusicPlaying',
        'tap [data-role="recordingArea"].active' : function (e) {
            if (!$(e.target).is('[data-role="clearRecording"]')) {
                this.playRecord();
            }
        },
        'touchstart [data-role="recordingBtn"]' : 'startRecord',
        'touchmove [data-role="recordingBtn"]': function (e) {
            e.preventDefault();
        },
        'touchend [data-role="recordingBtn"]' : function (e) {
            e.preventDefault();
            this.endRecord();
        },
        'click [data-role="clearRecording"]' : 'clearRecord',
        'click [data-role="toPre"]' : 'keepRecord',
        'click [data-role="sendCard"]' : 'shareCard',
        'focus [data-role="greetingArea"], [data-role="toWho"], [data-role="fromWho"]': 'pinFooter',
        'blur [data-role="greetingArea"], [data-role="toWho"], [data-role="fromWho"]': function () {
            this.unpinFooter();
            this.save();
        }
    },
    init: function(config){
        var id = config.id;
        this.config = config;
        this.config.$card[id-1].className = this.config.$card[id-1].className + ' active';

        this.cardMessage = {};
        this.recordingSrc = '';
        var self = this;
        Storage.get('cardMessage', function (data){
            data = data || {};
            self.cardMessage = data;
            if(typeof data.toWho === 'undefined' || data.toWho.length === 0){
                self.cardMessage.toWho = '';
            }
            if(typeof data.fromWho === 'undefined' || data.fromWho.length === 0){
                self.cardMessage.fromWho = '';
            }
            if(self.cardMessage.hasRecord){
                self.config.$recordingArea.addClass('active');
                self.config.$recordLength.html(self.cardMessage.recordLength);
                self.recordId = self.cardMessage.recordUrl;
            }else{
                self.config.$clearRecording.hide();
            }

            Storage.set('cardMessage', self.cardMessage);
        });

        BasePage.bindJsA();
        var self = this;
        this.recordLength = 0;
        NativeAPI.registerHandler('back', function( params, callback){
            if(self.config.$bgMusic[0] && !self.config.$bgMusic[0].paused){
                self.config.$bgMusic[0].pause();
            }
            if(self.config.$recordAudio[0] && !self.config.$recordAudio[0].paused){
                self.config.$recordAudio[0].pause();
            }
            callback({preventDefault:0});
        });
        NativeAPI.registerHandler('voice', function (params) {
            if (params.action === 'recordEnd' && params.record_id === self.recordId) {
                self.recordEnd(params);
            } else if (params.action === 'playEnd' && params.play_id === self.playId) {
                self.playEnd(params);
            }
        });
    },
    save: function () {
        var data = this.cardMessage;
        var config = this.config;
        data.toWho = config.$toWho.val();
        data.greetingArea = config.$greetingArea.val();
        data.fromWho = config.$fromWho.val();

        Storage.set('cardMessage', data);
    },
	toggleBgMusicPlaying: function () {
		var $btn = this.config.$bgPlayBtn;
		var music = this.config.$bgMusic[0];
		if ($btn.hasClass('active')) {
			music.pause();
		} else {
			music.play();
		}

		$btn.toggleClass('active');
	},
    closeBgMusic: function(){
        this.config.$bgPlayBtn.hide();
        this.config.$bgMusic[0].pause();
        this.cardMessage.hasMusic = false;
        Storage.set('cardMessage', this.cardMessage);
    },
    hideFooter: function(){
        this.config.$footer.hide();
    },
    showFooter: function () {
        this.config.$footer.show();
    },
    pinFooter: function () {
        this.config.$footer.css('position', 'absolute');
    },
    unpinFooter: function () {
        var $window = $(window);
        this.config.$footer.css('position', 'fixed');

        setTimeout(function () {
            $window
                .scrollTop($window.scrollTop() + 1)
                .scrollTop($window.scrollTop() - 1);
        }, 100);
    },
    getToWho: function(){
        this.cardMessage.toWho = this.config.$toWho[0].value;
        Storage.set('cardMessage', this.cardMessage,function(){});
    },
    getGreetingArea: function(){
        this.cardMessage.getGreetingArea = this.config.$getGreetingArea[0].value;
        Storage.set('cardMessage', this.cardMessage,function(){});
    },
    getFromWho: function(){
        this.cardMessage.fromWho = this.config.$fromWho[0].value;
        Storage.set('cardMessage', this.cardMessage,function(){});
    },
    clearToWho: function(){
        this.config.$toWho[0].value = '';
        this.cardMessage.toWho = '';
        Storage.set('cardMessage', this.cardMessage,function(){});
    },
    clearGreetingArea: function(){
        this.config.$greetingArea[0].value = '';
        this.cardMessage.greetingArea = '';
        Storage.set('cardMessage', this.cardMessage,function(){});
    },
    clearFromWho: function(){
        this.config.$fromWho[0].value = '';
        this.cardMessage.fromWho = '';
        Storage.set('cardMessage', this.cardMessage,function(){});
    },
    showRecordingArea: function(){
        if(this.config.$bgMusic){
            this.config.$bgMusic[0].pause();
        }
        this.config.$recordingMask.show();
    },
    closeRecoringMask: function(){
        this.config.$recordingMask.hide();
    },
    startRecord: function(){
        var self = this;
        if (this.recording) {
            return;
        }
        self.config.$recordingEffect.addClass('active');
        self.config.$recordingBtn.addClass('touch');
        this.recording = true;
        NativeAPI.invoke('voice', {
            action: 'startRecord'
        }, function (err, result) {
            if (err) {
                return;
            }
            self.recordId = result.record_id;
        });
    },
    endRecord: function(){
        var self = this;
        self.config.$recordingEffect.removeClass('active');
        self.config.$recordingBtn.removeClass('touch');

        NativeAPI.invoke('voice', {
            action: 'stopRecord',
            record_id: self.recordId
        },function (err){
            if(err){
                return;
            }else{
                self.config.$recordingMask.hide();
                //self.config.$playRecordingBtn.html('播放');
                self.config.$recordingArea.addClass('active');
                self.config.$clearRecording.show();
            }
        });
    },
    recordEnd: function(params){
        var self = this;
        this.recordId = params.record_id;
        this.config.$recordLength.html(Math.ceil(params.length));
        this.cardMessage.recordLength = Math.ceil(params.length);
        this.uploadAudio(function (err, result){
            if (!err) {
                self.recordingSrc = result.url;
                self.cardMessage.hasRecord = true;
                self.cardMessage.recordUrl = result.url;
            } else {
                self.cardMessage.hasRecord = false;
            }

            Storage.set('cardMessage', self.cardMessage, function (){});
        });
    },
    playEnd: function () {
        this.playId = null;
        this.playing = false;
    },
    playRecord: function(){
        var self = this;

        if (/^https?:/.test(this.recordId)) {
            if (!/\.mp3$/.test(this.recordId)) {
                this.recordId = this.recordId + '.mp3';
            }

            if (!this.record || this.record.src !== this.recordId) {
                this.record = new Audio();
                this.record.src = this.recordId;
            }
            this.record.play();
            return;
        }

        if (this.playing) {
            return;
        }
        this.playId = null;

        var params = {
            action: 'startPlay',
            record_id: this.recordId
        };

        NativeAPI.invoke('voice', params, function (err, data) {
            if (err) {
                return;
            }
            self.playing = true;
            self.playId = data.play_id;
        });
    },
    stopRecord: function(){
        NativeAPI.invoke('voice', {
            action: 'stopPlay',
            play_id: this.playId
        });
    },
    clearRecord: function(){
        var selfConfig = this.config;
        this.recordId = null;
        this.playId = null;
        this.recording = false;
        this.cardMessage.recordLength = 0;
        selfConfig.$playRecordingBtn.html('录音');
        selfConfig.$recordingArea.removeClass('active');
        selfConfig.$clearRecording.hide();
        this.cardMessage.hasRecord = false;
        this.cardMessage.recordUrl = '';
        this.cardMessage.recordLength = 0;
        Storage.set('cardMessage', this.cardMessage, function(){});
    },
    uploadAudio: function(callback){
        NativeAPI.invoke('voice', {
            action: 'upload',
            record_id: this.recordId
        }, callback);
    },
    keepRecord: function(){
        var self = this;
        this.cardMessage.hasEdit = 1;
        this.cardMessage.toWho = this.config.$toWho[0].value;
        this.cardMessage.fromWho = this.config.$fromWho[0].value;
        this.cardMessage.greetingArea = this.config.$greetingArea[0].value;

        if(self.config.$recordingArea.hasClass('active')){
            self.uploadAudio(function (err, result){
                if (!err) {
                    self.recordingSrc = result.url;
                    self.cardMessage.hasRecord = true;
                    self.cardMessage.recordUrl = result.url;
                } else {
                    self.cardMessage.hasRecord = false;
                }

                Storage.set('cardMessage', self.cardMessage, function (){});
				Util.redirect('app/client/app/misc/greeting_card/view/card/preview_card.js?template_id=' +self.config.id);
            });
        }else{
            self.recordingSrc = '';
            self.cardMessage.hasRecord = false;
            self.cardMessage.recordUrl = '';
            self.cardMessage.recordLength = 0;
            Storage.set('cardMessage', self.cardMessage, function (){});
            Util.redirect('app/client/app/misc/greeting_card/view/card/preview_card.js?template_id=' + self.config.id);
        }
    },
    shareCard: function(){
        var params = {};
        var cardId;
        var selfConfig = this.config;
        var self = this;
        var id = this.config.id;
        params.toWho = selfConfig.$toWho[0].value;
        params.greetingArea = selfConfig.$greetingArea[0].value;
        params.fromWho = selfConfig.$fromWho[0].value;
        params.tplId = id;
        params.hasMusic = this.cardMessage.hasMusic;
        if(selfConfig.$recordingArea.hasClass('active')){
            this.uploadAudio(function (err, result){
                if (!err) {
                    self.recordingSrc = result.url;
                    params.hasRecord = true;
                    params.recordUrl = result.url;
                    params.recordLength = self.cardMessage.recordLength;
                } else {
                    params.hasRecord = false;
                }

                CardAPI.createGreetingCard (params, function (err, data) {
                    if (err) {
                        window.alert(err);
                        return;
                    } else {
                        cardId = data;
                        var imgUrl = 'http://sta.ganji.com/att/project/app/greetingcard/images/thumbnail/card_0' + id + '.jpg';
                        if(id === '10'){
                            imgUrl = 'http://sta.ganji.com/att/project/app/greetingcard/images/thumbnail/card_10.jpg';
                        }
                        NativeAPI.invoke('showShareDialog',
                        {
                            text: TITLE_TEXT,
                            content: '‘滴滴滴’，你收到一封神秘的贺卡，是思念？是道歉？还是难以启齿的表白？赶紧点进去看看吧~~',
                            title: TITLE_TEXT,
                            url: 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/greeting_card/view/card/show_card.js?template_id=' + id +'&isShow=0&cardId=' + cardId,
                            img: imgUrl
                        }, function (err) {
                            if (!err) {
                                Storage.clear();
                            }
                        });
                        gjLog.send('100000000216000100000010');
                    }
                });
            });
        }else{
            params.hasRecord = false;
            params.recordUrl = '';
            params.recordLength = 0;
            CardAPI.createGreetingCard (params, function (err, data) {
                if (err) {
                    window.alert(err);
                    return;
                } else {
                    cardId = data;
                    var imgUrl = 'http://sta.ganji.com/att/project/app/greetingcard/images/thumbnail/card_0' + id + '.jpg';
                    if(id === '10'){
                        imgUrl = 'http://sta.ganji.com/att/project/app/greetingcard/images/thumbnail/card_10.jpg';
                    }
                    NativeAPI.invoke('showShareDialog',
                    {
                        text: TITLE_TEXT,
                        content: '‘滴滴滴’，你收到一封神秘的贺卡，是思念？是道歉？还是难以启齿的表白？赶紧点进去看看吧~~',
                        title: TITLE_TEXT,
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
    }
});

exports.changeTemplate = Widget.define({
    events: {
        'tap [data-url]': function (e) {
            Util.redirect($(e.currentTarget).data('url'));
        }
    }
});