/*h5 game wf@ganji.com*/
var Widget    = require('com/mobile/lib/widget/widget.js');
var _         = require('underscore');
var $         = require('$');
// var Cookie    = require('com/mobile/lib/cookie/cookie.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

var Log       = require('com/mobile/lib/log/tracker.js');

var _evLog = function (ev) {
    try{
        Log.send(ev);
    }catch(e){}
};

var Url       = require('com/mobile/page/milan/widget/urlParams.js');
var isNative  = NativeAPI.isSupport();
/*data config*/
var _gender    = 'f';
// var expiresDay = 60 * 60 * 24 * 15;

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var loading = {
    popUp: function () {
        $('[data-role="loading"]').addClass('active');
        $('#loadingMask').addClass('active');
    },
    slowDown: function (){
        $('[data-role="loading"]').removeClass('active');
        $('#loadingMask').removeClass('active');
    }
};
var service = {
    getData: function (param, callback) {
        $.ajax($.extend({
            type:'GET',
            dataType:'json'
        }, param))
        .done(function (data) {
            if (data.ret === -1) {
                callback(data.msg);
                return;
            }
            callback(null, data);
        }).fail(function () {
            callback('提示：网络错误！');
        });
    },
    postData: function (param, callback) {
        $.ajax($.extend({
            type: 'POST',
            dataType: 'json'
        }, param))
        .done(function (data) {
            if (data.ret === -1) {
                callback(data.msg);
                return;
            }
            callback(null, data);
        })
        .fail(function () {
            callback('提示：网络错误！');
        });
    }
};
var avatar = function (gender, isLose) {
        var count   = isLose ? getRandom(7, 8) : getRandom(1, 6);
        var operate = isLose ? 'lose' : 'add';
        var avatar  = 'avatar-' + (gender || 'f');
        return avatar + (count) + ' avatar-'+operate;
    };

var _config = {
    gameMap: {
        z: {style: function () {return avatar(_gender, false);}, tip: '<i class="icon icon-add fadeInUp">+100</i>'},
        y: {style: function () {return avatar(_gender, true);}, tip: '<i class="icon icon-lose fadeInUp">-100</i>'},
        x: {style: function () {return 'avatar-half';},  tip: '<i class="icon icon-half fadeInUp">减半</i>'},
        a: {style: function () {return 'avatar-reset';}, tip: '<i class="icon icon-reset fadeInUp">置零</i>'},
        b: {style: function () {return 'avatar-time';},  tip: '<i class="icon icon-time fadeInUp">+5秒</i>'}
    },
    speeds:['', 'speed-f', 'speed-ff'],
    badge: ['酱油人生', '爱我先排号 ', '夜夜印桃花', '只是个传说']

};

/*主操作引擎*/
exports.game = Widget.define({
    events: {
        'touchstart [data-role="role"]' : function (e) {
            this.fire(e);
        },
        'Event::setRole': function (event, roleControl) {
            var location = this.location++;
            switch (location){
                case 100:
                    this.speedLevel = 1;
                    this.fallenHz--;
                    break;
                case 200:
                    this.speedLevel = 2;
                    break;
                default:
                    break;
            }
            this.setRoleContorl($(roleControl), location);
        },
        'Event::updateScroe': function (event, data) {
            this.score = data.score;
            this.config.$score.text(data.score);
            this.trackPostion(data.value);
        },
        'Event::updateTime': function (event, time) {
            this.config.$gameTime.text(time);
        },
        'Event::start': function (event, data) {
            this.start(data.gender);
        },
        'Event::restart': function () {
            // window.location.reload();
            this.restart();
        }
    },
    init: function (config) {
        this.config        = config;

        this.$el           = config.$el;
        // this.$redRect      = config.$redRect;
        this.$gameScene    = config.$gameScene;
        this.$paths        = config.$path;

        this.gameMapString = null;
        // this.gameMap       = _config.gameMap;
        // this.speeds        = _config.speeds;
        this.badge         = _config.badge;
        this.fallenHz      = 1;

        this.position      = [];
        this.speedLevel    = 0;

        this.lastValue     = 0;
        this.score         = 0;
        this.timmer        = 0;
        this.fallenTime    = 2.7;
        //游戏时间
        this.gameTime      = config.gameTime || 60;

        //计时
        this.timeCount     = this.gameTime;
        this.isPause       = false;
        this.isOver        = false;
        this.gameLevel     = 0;

        this.sceneHeight   = this.$gameScene.height();
        // this.redRectHeight = this.$redRect.height();
        this.location      = 0;
        this.gameData      = {};
        // this.start();

    },
    start: function (gender) {
        // if(!Cookie.get('_h5_game_isFirst')){
        //     var cookieConfig = {
        //         expires: expiresDay,
        //         path: '/',
        //         domain: '.ganji.com'
        //     };
        //     // Widget.ready(this.config.guideRefer, function (wg) {
        //     //     wg._show();
        //     // });
        //     // Cookie.set('_h5_game_isFirst', 1, cookieConfig);
        // }
        _gender        = gender || _gender;

        this.gameMap   = _config.gameMap;
        this.speeds    = _config.speeds;
        this.initRole();
        $('body').on('touchmove', function (e) {
            e.preventDefault();
        });
    },
    pause: function () {
        if (!this.isPause) {
            this.isPause = true;
        }
    },
    restart: function () {
        var self = this;
        self.init(self.config);
        loading.popUp();
        self.config.$score.text('0');
        setTimeout(function () {
            loading.slowDown();
            self.start();
        }, 1000);
        _evLog('restart'+ _gender);
    },
    fire: function (e) {
        var $cur  = $(e.currentTarget);
        var score = this.score;
        var time  = this.timeCount;
        var value = $cur.attr('data-value');
        if (value === this.lastValue) {
            return;
        }
        this.lastValue = value;

        $cur.addClass('active');

        if ($cur.hasClass('avatar-half')) {
            score = score/2;
        }else  if ($cur.hasClass('avatar-lose')){
            score = score - 100;
        }else  if ($cur.hasClass('avatar-reset')){
            score = 0;
        }else if ($cur.hasClass('avatar-time')){

            this.timeCount = time + 5;
            this.$el.trigger('Event::updateTime', time + 5);
            return;
        }else {
            score = score + 100;
        }
        this.$el.trigger('Event::updateScroe',{
            score: score < 0 ? 0 : score,
            value: value
        });
    },
    tick: function () {
        var self   = this;
        var count  = getRandom(6, 10);
        var index  = 0;
        var i      = 0;
        var paths  = self.$paths;

        var handel = function(){
            if (index >= 4) {
                index = 0;
                paths = _.shuffle(paths);
            }
            var roleControls = $(paths[index]).find('[data-role="roleControl"].ready');
            var randIndex    = getRandom(0, roleControls.length-1 === 0? 0 : roleControls.length-1);
            self.handleRole($(roleControls[randIndex]));
            setTimeout(function () {
                if(i < count){
                    handel();
                }
            }, getRandom(20, 1000));
            index ++;
            i++;
        };
        handel();

    },
    loop: function () {
        var self = this;
        var hz   = self.fallenHz;
        if (!self.timmer) {
            self.timeCount --;
            self.timmer = setInterval(function () {
                if (self.timeCount < 0) {
                    clearInterval(self.timmer);
                    self.gameOver();
                    return false;
                }
                if (self.isPause) {
                    return false;
                }

                self.$el.trigger('Event::updateTime', self.timeCount--);

                if (self.timeCount % hz === 0) {
                    self.tick();
                }
            }, 1000);
        }
    },
    initRole: function () {
        var self         = this;
        var pathIndex    = 0;
        var roleIndex    = 0;
        // var _map         = self.gameMap;

        var $paths       = self.$paths;
        var path         = null;
        var $roleControl = null;
        var i            = 0;
        loading.popUp();
        service.getData({
            url: self.config.mapUrl
        },function (err, data) {
            loading.slowDown();
            if (err) {
                window.alert(err);
                return;
            }

            self.gameMapString = atob(data.map);

            for (; i < 12; i++) {
                if(pathIndex >= 4){
                    pathIndex = 0;
                    roleIndex++;
                }
                path         = $paths[pathIndex];
                $roleControl = $($(path).find('[data-role="roleControl"]')[roleIndex]);
                self.setRoleContorl($roleControl, self.location);
                self.location++;
                pathIndex++;
            }
            self.gameData = data;
            self.loop();

        });
    },
    setRoleContorl: function ($roleControl, value) {
        var self      = this;
        var key       = self.gameMapString[value];
        if (self.isOver) {
            return  false;
        }
        if (!key){
            return false;
        }
        var gameMap   =  self.gameMap;
        var roleClass = gameMap[key].style();
        var roleTip   = gameMap[key].tip;
        var $role     = $roleControl.find('[data-role="role"]');
        $role.attr('data-value', value);
        $roleControl.addClass('ready ' + self.speeds[self.speedLevel]);
        $role.addClass(roleClass).append(roleTip);
    },
    handleRole: function ($roleControl) {
        var self  = this;
        $roleControl.addClass('active');
        $roleControl.removeClass('ready');
        // red control

        setTimeout(function () {
            self.resetRoleControl($roleControl);
            self.$el.trigger('Event::setRole', $roleControl);
        }, self.fallenTime * 1000);
    },
    resetRoleControl: function ($roleControl) {
        var $role = $roleControl.find('[data-role="role"]');
        $role.attr({'class':'avatar', 'data-value':0}).html('');
        $roleControl.attr('class', 'avatar-box');
    },
    trackPostion: function (pos) {
        this.position.push(pos);
    },
    gameOver: function () {
        var self  = this;
        var score = self.score;
        if (score >= 8000 && score < 12000) {
            self.gameLevel = 1;
        }
        if (score >= 12000 && score < 15000) {
            self.gameLevel = 2;
        }
        if (score >= 15000 ) {
            self.gameLevel = 3;
        }
        $('body').off('touchmove');
        var data = $.extend(self.gameData,
            {
                position: self.position.join(',') || '-1',
                badge: self.badge[self.gameLevel],
                score: score
            });
        self.isOver = true;
        $(self.config.refer).trigger('Event::resultPop', data);
    }
});

/*操控面板*/
exports.index = Widget.define({
    events: {
        'click [data-role="gender"]': function (e) {
            var $cur = $(e.currentTarget);
            this.startGame($cur.data());
        }
    },
    init : function (config) {
        this.config = config;
        this.$refer = $(config.refer);
        if (isNative) {
            _evLog('h5_game_paopao_native@atype=click');
        }else{
            _evLog('h5_game_paopao_weixin@atype=click');
        }
    },
    startGame: function (obj) {
        var self = this;
        self.chagePageTo('game');
        self.$refer.trigger('Event::start', obj);
    },
    chagePageTo: function (page) {
        $('body').attr('class', page);
    }
});

/*结果页面*/
exports.result = Widget.define({
    events: {
        'Event::forbidBind': function () {
            this.config.$bindingPop.text('已绑定').addClass('disabled');
            this.isForbid = true;
        },
        'Event::resultWrap': function  (events, data) {
            this.data = data;
            this.renderWrap(data);
            this.chagePageTo('result');
        },
        'click [data-role="bindingPop"]': function (e) {
            e.preventDefault();
            if (this.isForbid) {
                return ;
            }
            this.$refer.trigger('Event::bindingPop',
                {
                    token: this.data.id,
                    refer: this.config.$el
                });
        },
        'click [data-role="share"]': function (e) {
            e.preventDefault();
            this.share();
        },
        'click [data-role="download"]': function (e) {
            e.preventDefault();
            if ($.os.iphone || $.os.ipod || $.os.ipad) {
                window.location.href = this.iosUrl;
            }else{
                window.location.href = this.androidUrl;
            }
        }
    },
    init: function (config) {
        this.config     = config;
        this.$refer     = $(config.refer);
        this.data       = {score:null, badge: null};
        this.iosUrl     = config.iosUrl;
        this.androidUrl = config.androidUrl;
        this.isForbid   = false;
    },
    chagePageTo: function (page) {
        $('body').attr('class', page);
    },
    renderWrap: function (data) {
        var self = this;
        self.config.$score.text(data.score);
        self.config.$badge.text(data.badge);
    },
    share: function () {
        var title = '我获得'+ this.data.score +'分，注定“'+ this.data.badge +'”！眼看IPhone6到手，你行？你来啊！';
        if (isNative) {
            this.shareNative(title);
        }else{
            this.shareWeiXin(title);
        }
    },
    shareDialog: function () {
        var self    = this;
        var $dialog = $('#shareDialog');
        var $mask   = $('#mask');
        $dialog.on('click', function () {
            self.shareDialog()._hide();
        });
        return {
            _show: function () {
                $dialog.addClass('active');
                $mask.addClass('active');
            },
            _hide: function () {
                $dialog.removeClass('active');
                $mask.removeClass('active');
            }
        };
    },
    shareNative: function (title) {
        var shareData = window.shareData;
        // var self = this;
        if (!shareData) {
            return;
        }
        NativeAPI.invoke(
        'weixinShare',
        {
            title     : title,
            url       : shareData.timeLineLink,
            image     : shareData.imgUrl,
            istimeline: 1,
            type      : 2
        },
        function (err) {
            if (err) {
                window.alert(err.message);
                return;
            }
        });
    },
    shareWeiXin: function (title) {
        this.shareDialog()._show();
        document.title = window.shareData.tTitle = title;
        try {
            window.WeixinJSBridge.call('showOptionMenu');
        } catch (c) {}
    }
});

/*结果弹框*/
exports.resultPop = Widget.define({
    events: {
        'Event::resultPop': function (event, data) {
            var self      = this;
            this.gameData = data;
            // fix android bug
            $('#tipsAlert').hide();
            this.renderPanel(function () {
                self._show();
            });
        },
        'click [data-role="restart"]': function (e) {
            e.preventDefault();
            this.$refer.trigger('Event::restart');
            this._hide();
        },
        'click [data-role="confirm"]': function (e) {
            e.preventDefault();
            this.$resultRefer.trigger('Event::resultWrap', this.gameData);
            this._hide();
        }
    },
    init: function (config) {
        this.config       = config;
        this.$el          = config.$el;
        this.$mask        = $(config.maskRefer || '#mask');
        this.$refer       = $(config.refer);
        this.$resultRefer = $(config.resultRefer);
        this.gameData     = null;
    },
    _show: function () {
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    },
    renderPanel: function  (callback) {
        // 获取分数
        var self = this;
        var obj  = self.gameData;
        loading.popUp();
        service.postData({
            url: self.config.url,
            data: {
                number: btoa(obj.position),
                token: btoa(obj.id),
                isNative: isNative
            }
        }, function (err, data) {
            if(err){
                window.alert(err);
                return false;
            }
            loading.slowDown();
            self.config.$score.html(data.data.score);
            self.config.$badge.text(obj.badge);
            self.gameData = $.extend(self.gameData, data.data);
            if(callback){
                callback();
            }
        });
    }
});

/*引导弹框*/
exports.guidePop = Widget.define({
    events: {
        'Event::guidePop': function () {
            this._show();
        },
        'click': function (e) {
            e.preventDefault();
            if (this.hideAble) {
                this._hide();
            }
        }
    },
    init: function (config) {
        var self      = this;
        this.config   = config;

        this.hideAble = false;
        this.$el    = config.$el;
        this.$mask  = $(config.maskRefer || '#mask');
        this.$mask.on('click', function (e) {
            e.preventDefault();
            if (self.hideAble) {
                self._hide();
            }
        });
    },
    _show: function () {
        this.hideAble = true;
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    }
});

/*领奖和兑奖*/
exports.award = Widget.define({
    events:{
        'click [data-role="lottery"]': function (e) {
            e.preventDefault();
            var $cur = $(e.currentTarget);
            var self = this;
            var id   = $cur.data('id');
            var text = '确定要兑换"'+ self.awards[id - 1] + '"吗？';
            if ($cur.hasClass('sellout') || $cur.hasClass('disabled')) {
                return ;
            }
            self.$cur = $cur;
            if (id === 5) {
                text = '确定参加抽奖吗？';
            }
            self._confirm({
                $refer: self.config.$el,
                text: text
            });
        },
        'Form::Valid': function (e) {
            e.preventDefault();
            this.getAward();
        },
        'Event::confirm': function () {
            this.getGift(this.$cur);
        },
        'click [data-role="saveAddress"]': 'saveAddress'
    },
    init: function (config) {
        this.config     = config;
        this.url        = config.url;
        this.zhijianUrl = config.zhijianUrl || 'http://sk10800.qiniudn.com/com.qihoo360.smartkey-v1.8.0-src0035.apk';

        this.$cur   = null;

        this.awards     = ['360智键', '京东购物卡', '豪华酒店', 'iPhone6'];
        this.awardData  = Url.getUrlParams('awards');
        this.phone      = null;
        if (this.awardData) {
            var data = JSON.parse(decodeURIComponent(this.awardData));
            this.phone = data.phone;
            this.renderAward(data);
        }
        this.getSellout();
    },
    getAward: function () {
        var self   = this;
        var param  = self.config.$form.serializeArray();
        self.phone = param[0].value;
        //领取奖品
        loading.popUp();
        service.postData({
            url: self.config.awardUrl,
            data: param
        },function (err, data) {
            loading.slowDown();
            if (err) {
                self._alert(err);
                return;
            }
            self.renderAward(data.data);
        });
    },
    getGift: function ($cur) {
        var self = this;
        var id   = $cur.data('id');

        loading.popUp();
        service.postData({
            url: self.config.url,
            data: {
                id: id,
                phone: self.phone,
                isNative: isNative
            }
        }, function (err, data) {
            loading.slowDown();
            if (err) {
                self._alert(err);
                return;
            }
            var $node = $('#lottery'+id);
            if (id === 5) {
                self._alert('欢迎参加本次抽奖！');
            }else if (id === 1 && $.os.android) {
                self.setDisable($node);
                self._alert('恭喜你，已成功获得'+ self.awards[0] +'1个，请注意填写您的住址，以便发货！');
                window.location.href = self.zhijianUrl;
            }else{
                self._alert('恭喜你，已成功获得'+ self.awards[id-1] +'1个，请注意填写您的住址，以便发货！');
                self.setDisable($node);
            }
            self.renderAward(data.data);
        });
    },
    renderAward: function (data) {
        var self      = this;
        var awards    = data.award;
        var awardsStr ='';
        self.config.$formWidget.removeClass('active');
        self.config.$user.addClass('active');
        self.setUserStuff(awards);
        if (awards) {
            awards.forEach(function (item) {
                awardsStr += self.awards[item.id-1] +';';
                self.setDisable($('#lottery'+item.id));
            });
        }else{
            awardsStr = '暂无！';
        }
        self.config.$phoneTxt.text(self.phone);
        self.config.$awardsTxt.text(awardsStr);
        self.config.$scoreTxt.text(data.score);
    },
    saveAddress: function (e) {
        var $cur = $(e.currentTarget);
        var self = this;
        var address = $.trim(self.config.$address.val());
        if (!address || $cur.hasClass('disabled')) {
            return;
        }
        if (address.length < 6) {
            self._alert('地址太短，请检查您的地址是否正确！');
            return;
        }
        loading.popUp();
        service.postData({
            url: self.config.addressUrl,
            data: {
                phone: self.phone,
                address: address
            }
        },function (err) {
            loading.slowDown();
            if (err) {
                self._alert(err);
                return;
            }
            self.config.$address.val('');
            self.config.$saveAddress.text('已发送').addClass('disabled');
            self._alert('地址保存成功，我们将尽快为您发送奖品！请保持您的手机：'+ self.phone + '畅通！');
        });
    },
    setEnable: function ($node) {
        $node.removeClass('disabled');
    },
    setDisable: function ($node) {
        $node.text('已兑奖').addClass('disabled');
    },
    setUserStuff: function (awards) {
        var self = this;
        self.config.$lottery.removeClass('disabled');
        self.config.$user.addClass('active');
        if (awards && awards.length > 0) {
            $('#userStuff').addClass('active');
        }
    },
    getSellout: function () {
        var self = this;
        service.getData({
            url: self.config.selloutUrl
        }, function (err, data) {
            if (err) {
                return;
            }
            var ids = data.data;
            if (ids.length > 0) {
                ids.forEach(function (item){
                    self.setSellout($('#lottery'+ item));
                });
            }
        });
    },
    setSellout: function ($node) {
        $node.text('已兑完').addClass('sellout');
    },
    _alert: function (err) {
        $('#tipsPop').trigger('Event::tipsPop', {text: err});
    },
    _confirm: function (data) {
        $('#confirmPop').trigger('Event::confirmPop', data);
    }
});

//绑定手机号
exports.bindingPop = Widget.define({
    events: {
        'Event::bindingPop': function (event, data) {
            this.token = data.token;
            this.$refer = $(data.refer);
            this._show();
        },
        'Form::Valid': function (e) {
            e.preventDefault();
            var self = this;
            this.bindPhone(function () {
                self._hide();
            });
        },
        'click [data-role="close"]': function (e) {
            e.preventDefault();
            this._hide();
        }
    },
    init: function (config) {
        this.config = config;
        this.$el    = config.$el;
        this.token  = null;
        this.$mask  = $(config.maskRefer || '#mask');
        this.awardUrl = config.awardUrl || 'http://3g.ganji.com/misc/guanggunjie/?action=award&isNative=true';
    },
    _show: function () {
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    },
    bindPhone: function (callback) {
        var self  = this;
        var formData = self.config.$form.serializeArray();
        loading.popUp();

        service.postData({
            url: self.config.url,
            data: {
                phone: formData[0].value,
                code: formData[1].value,
                token: self.token

            }
        },function (err, data) {
            loading.slowDown();
            if (err) {
                window.alert(err);
                return;
            }
            _evLog('h5_game_paopao_binding_sucess@atype=click');
            self.$refer.trigger('Event::forbidBind');
            window.alert('操作成功，快去领奖吧！');
            if (isNative) {
                data.data.phone = formData[0].value;
                window.location.href = self.awardUrl +
                        '&awards=' + JSON.stringify(data.data);
            }
            if (callback) {
                callback();
            }
        });
    }
});


exports.confirmPop = Widget.define({
    events: {
        'Event::confirmPop': function (event, data) {
            this.$refer = data.$refer;
            this.renderPanel(data.text);
            this._show();
        },
        'click [data-role="confirm"]': function (e) {
            e.preventDefault();
            this.$refer.trigger('Event::confirm');
            this._hide();
        },
        'click [data-role="cancel"]': function (e) {
            e.preventDefault();
            this.$refer.trigger('Event::cancel');
            this._hide();
        }
    },
    init: function (config) {
        this.config = config;
        this.$refer = $(config.refer);
        this.$el    = config.$el;
        this.$mask  = $(config.maskRefer || '#mask');
    },
    _show: function () {
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    },
    renderPanel: function (text) {
        this.config.$content.text(text);
    }
});

exports.tipsPop = Widget.define({
    events: {
        'Event::tipsPop': function (event, data) {
            this.renderPanel(data.text);
            // this.$refer = data.$cur;
            this._show();
        },
        'click [data-role="confirm"]': function (e) {
            e.preventDefault();
            // this.$refer.trigger('Event::tipOff');
            this.renderPanel('');
            this._hide();
        }
    },
    init: function (config) {
        this.config = config;
        // this.$refer = $(config.refer);
        this.$el    = config.$el;
        this.$mask  = $(config.maskRefer || '#mask');
    },
    _show: function () {
        this.$el.addClass('active');
        this.$mask.addClass('active');
    },
    _hide: function () {
        this.$el.removeClass('active');
        this.$mask.removeClass('active');
    },
    renderPanel: function (text) {
        this.config.$content.text(text);
    }
});
