var Widget = require('com/mobile/lib/widget/widget.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var BasePage = require('com/mobile/page/milan/base_page.js');
var Cookie    = require('com/mobile/lib/cookie/cookie.js');
var Log = require('com/mobile/lib/log/tracker.js');
var $ = require('$');
var WeixinApi = require('com/mobile/lib/wxapi/wxapi.js');

var getInstallId = require('app/client/common/lib/mobds/api/get_install_id.js');

var NativeServiseAPI = require('app/client/common/lib/mobds/http_api.js');

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

exports.init = function () {
    BasePage.init();

    Widget.ready(
        ['#turntable', '#no-prize-pop', '#no-chance-pop', '#success-pop', '#app-win-pop', '#app-guide-pop','#packet-success-pop'],
        function (turntableWidget, noPrizePopup, noChancePopup, successPopup, appWinPopup, appFailPop, packetPop) {
            turntableWidget.config.$el
                .on('no-prize', function (e, data) {
                    noPrizePopup.show(data);
                })
                .on('no-chance', function (e, data) {
                    noChancePopup.show(data);
                })
                .on('success', function (e, data) {
                    successPopup.show(data);
                })
                .on('app-success', function (e, data) {
                    appWinPopup.show(data);
                })
                .on('app-fail', function (e, data) {
                    appFailPop.show(data);
                })
                .on('red-packet-success', function (e, data) {
                    packetPop.show(data);
                });
        }
    );

    NativeAPI.registerHandler('back', function (params, callback) {
        if (window.document.referrer) {
            window.history.back();
            callback({preventDefault: 1});
        } else {
            callback({preventDefault: 0});
        }
    });
};

exports.scrollList = Widget.define({
    events: {
        'touchstart': function () {
            this.stop();
        }
    },
    init: function (config) {
        this.config = config;
        this.scroll();
    },
    scroll: function () {
        var el = this.config.$el[0];
        var top = el.scrollTop;
        var self = this;
        this.timer = setInterval(function () {
            el.scrollTop = el.scrollTop + 3;
            if (el.scrollTop === top) {
                clearInterval(self.timer);
            } else {
                top = el.scrollTop;
            }
        }, 200);
    },
    stop: function () {
        clearInterval(this.timer);
    }
});

exports.popup = Widget.define({
    events: {
        'click [data-role="close"]': 'close',
        'tap [data-role="share"]': 'share'
    },
    init: function (config) {
        this.config = config;
    },
    close: function () {
        this.config.$el.hide();
        $('#mask').hide();
    },
    show: function (data) {
        Log.send('show_pop/' + data.code);
        this.data = data;
        this.config.$tip.html(data.content.tip);
        this.config.$content.html(data.content.value);

        if (parseInt(data.code, 10) >= 0) {
            if (data.btn_list) {
                this.config.$el.find('.js-btn-left')
                    .text(data.btn_list[0].value)
                    .attr('href', data.btn_list[0].url);
            }
        }

        this.config.$el.show();
        $('#mask').show();
    },
    share: function () {
        var callbackUrl = this.data.btnshareInfo.callback_url;
        NativeAPI.invoke('showShareDialog', {
            type: 2,
            text: this.data.btnshareInfo.title,
            content: this.data.btnshareInfo.content,
            title: this.data.btnshareInfo.title,
            image: this.data.btnshareInfo.image,
            img: this.data.btnshareInfo.image,
            url: this.data.btnshareInfo.url
        }, function (err) {
            if (!err) {
                Log.send('weixinShareSuccess');
                window.location.href = callbackUrl;
            }
        });
    }
});

exports.checkAuthCode = function (value, config, callback) {
    callback(null);
};

exports.checkCheckCode = function (value, config, callback) {
    callback(null);
};

exports.appWinPopup = Widget.define({
    events: {
        'tap [data-role="send"]': 'sendAuthcode',
        'tap [data-role="checkCode"]': 'refreshCheckcode',
        'field-error [data-role="field"]': function (e, err) {
            BasePage.tip(err.message, 3000);
        },
        'error [data-role="form"]': function (e, errors) {
            BasePage.tip(errors[Object.keys(errors)[0]].message, 3000);
        },
        'click [data-role="link"]': 'goApp',
        'click [data-role="close"]': 'close'
    },
    init: function (config) {
        this.config = config;
    },
    refreshCheckcode: function () {
        var $img = this.config.$checkCode.find('img');
        $img.attr('src', $img.attr('src').replace(/nocache=.*$/, 'nocache=' + Date.now()));
    },
    sendAuthcode: function () {
        var form = this.config.$form.serializeObject();
        var self = this;

        Widget.ready(this.config.$form, function (formWidget) {
            formWidget.validate(function (err) {
                if (err) {
                    return;
                }
                $.ajax({
                    url: '/misc/dazhuanpan/?action=sendphonecode',
                    data: {
                        phone: form.phone,
                        checkcode: form.checkcode,
                        pay: self.prizeData.data_pay
                    },
                    type: 'post',
                    dataType: 'json'
                })
                    .done(function (data) {
                        if (data.status === -1) {
                            BasePage.tip(data.error[Object.keys(data.error)[0]], 3000);
                            self.refreshCheckcode();
                            self.config.$el.find('input[name="checkcode"]').val('');
                        } else {
                            BasePage.tip('提交成功', 3000);
                            self.close();
                            Widget.ready('#go-app-pop', function (goAppPop) {
                                goAppPop.show(self.prizeData);
                            });
                        }
                    });
            });
        });
    },
    show: function (data) {
        Log.send('show_pop/' + data.code);
        this.prizeData = data;
        $(this.config.$tip).html(data.content.tip);
        $(this.config.$content).html(data.content.value);
        this.config.$el.addClass('active');
        $('#mask').addClass('active');
    },
    close: function () {
        this.config.$el.removeClass('active');
        $('#mask').removeClass('active');
    },
    goApp: function () {
        var self = this;
        if (window.navigator.userAgent.match(/android/i)) {
            window.location.href =  self.prizeData.btn_list[0].url;
        } else {
            setTimeout(function () {
                window.location.href = self.prizeData.btn_list[0].url;
            }, 500);
        }
        setTimeout(function () {
            window.location.href = self.prizeData.btn_list[0].timeout_url;
        }, 800);
    }
});

exports.appLink = function (config) {
    config.$el.tap(function () {
        if (window.navigator.userAgent.match(/android/i)) {
            window.location.href = config.url;
        } else {
            setTimeout(function () {
                window.location.href = config.url;
            }, 500);
        }
        setTimeout(function () {
            window.location.href = config.urlTimeout;
        }, 800);
    });
};

exports.share = function (config) {
    config.$el.on('click', function () {
        NativeAPI.invoke('showShareDialog', {
            type: config.type,
            title: config.title,
            text: config.title,
            content: config.content,
            image: config.image,
            url: config.url,
            istimeline: config.istimeline
        }, function (err) {
            if (!err) {
                Log.send('weixinShareSuccess');
            }
        });
    });
};

exports.weixinShare = Widget.define({
    events: {
        'click': function (e) {
            e.preventDefault();
            Log.send('weixinShare_click');
            this.share();
        }
    },
    init: function (config) {
        var self = this;
        this.hasGet = false;
        this.wxData = {
            'appId'  : config.appId || '',
            'imgUrl' : config.imgUrl || '',
            'link'   : config.link || '',
            'desc'   : config.desc || '',
            'title'  : config.title || ''
        };
        this.config = config;
        WeixinApi.ready(function (API) {
            API.shareToFriend(self.wxData);
            API.shareToTimeline(self.wxData);
            API.showOptionMenu();
        });
    },
    share: function () {
        var self = this;
        if (self.hasGet) {
            self.shareDialog()._show();
            return;
        }
        service.getData({
            url : self.config.ajaxUrl
        }, function (err, data) {
            if (err) {
                window.alert(err);
            }
            self.hasGet = true;
            if (data.data) {
                var theData = data.data;
                self.wxData.title = theData.title;
                self.wxData.link  = theData.link || self.wxData.link;
            }
            WeixinApi.shareToTimeline(self.wxData);
            WeixinApi.shareToFriend(self.wxData);
            self.shareDialog()._show();
        });
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
    }
});


exports.subscribe = Widget.define({
    events: {
        'Events::confirm': function () {
            this.tab(this.config.$tab);
        },
        'click [data-role="tab"]' : function (e) {
            e.preventDefault();
            this.tab($(e.currentTarget));
        }
    },
    init: function (config) {
        var self        = this;
        this.config     = config;
        this.$el        = config.$el;
        this.expiresDay = this.config.expiresDay || 60 * 60 * 24 * 3;

        this.tipsText   = config.tipsText || ['您已关闭每日活动提醒!','您已打开每日活动提醒，活动期间会在每日10点左右提醒您参与，请保证app消息推送打开哦~'];
        this.tipsTimeout = config.tipsTimeout || 3;
        this.userType   = config.userType || 0;
        self.customeId  = config.customeId || 0;
        this.installId  = 0;
        this.deleteId   = 0;
        this.tabCode    = 0;

        this.nativeServiseAPI = new NativeServiseAPI({
            path: config.uri || '/webapp/shop/subscription/'
        });

        getInstallId(function (err, installId) {
            if (err) {
                return;
            }
            self.installId = installId;
            self.service({
                type:'GET',
                data:{
                    install_id: installId,
                    user_type: self.userType
                }
            }, function (err, data) {
                if (err) {
                    // window.alert(err);
                    return;
                }
                self.tabCode  = data.set;
                self.deleteId = data.id || installId +'_'+ self.userType;
                if (self.deleteId) {
                    self.showWrap();
                }
                if (self.tabCode === 1) {
                    self.tabOn();
                }else{
                    self.showConfirmPop();
                    self.tabOff();
                }
            });
        });
    },
    tab: function ($tab) {
        var self = this;
        if (self.isPending) {
            return;
        }
        self.pending();
        if (!$tab.hasClass('active')) {
            self.service({
                type: 'POST',
                data: {
                    install_id: self.installId,
                    user_type: self.userType
                }
            }, function (err) {
                if (err) {
                    window.alert(err);
                    return ;
                }
                self.tabOn();
                self.pendingOff();
                BasePage.tip(self.tipsText[1], self.tipsTimeout * 1000);
            });
        }else{
            self.service({
                type: 'DELETE',
                query:'?id='+ self._deleteId(),
                data: {
                    id: self._deleteId()
                }
            }, function (err) {
                if (err) {
                    window.alert(err);
                    return;
                }
                self.tabOff();
                self.pendingOff();
                BasePage.tip(self.tipsText[0], self.tipsTimeout * 1000);
            });
        }
    },
    _deleteId: function () {
        return this.deleteId;
    },
    showWrap: function () {
        var self = this;
        self.$el.show();
    },
    service: function (param, callback) {
        var self    = this;
        var request = self.nativeServiseAPI.request(param.type, {'X-Ganji-Agent' : 'H5'}, param.query || '', param.data);
        request.done(function (data) {
            callback(null, data.data);
        })
        .fail(function (err) {
            callback(err.message);
        });
    },
    tabOff: function () {
        var self = this;
        var $tab  = self.config.$tab;
        if (!$tab.hasClass('active')) {
            return;
        }
        self.config.$tab.removeClass('active');
    },
    tabOn: function () {
        var self = this;
        var $tab  = self.config.$tab;
        if ($tab.hasClass('active')) {
            return;
        }
        self.config.$tab.addClass('active');

    },
    pending: function () {
        this.isPending = true;
    },
    pendingOff: function () {
        this.isPending = false;
    },
    showConfirmPop: function () {
        var self = this;
        var cookieConfig = {
                expires: self.expiresDay,
                path: '/',
                domain: '.ganji.com'
            };
        if (Cookie.get('_subscribe_')) {
            return;
        }
        setTimeout(function () {
            $(self.config.refer).trigger('Events::confirmPop');
        }, (self.config.timeout || 1) * 1000);

        Cookie.set('_subscribe_', 1, cookieConfig);
    }
});

exports.disappear = function (config) {
    setTimeout(function () {
        config.$el.hide();
        $(config.refer).hide();
    }, config.timmer * 1000 || 3000);
};

exports.download = Widget.define({
    events: {
        'click': function (e) {
            e.preventDefault();
            $(this.config.refer).trigger('Events::alertPop');
        }
    },
    init: function (config) {
        this.config = config;
    }
});

exports.checkPrize = Widget.define({
    events: {
        'click': function (e) {
            e.preventDefault();
            if (this.config.$el.hasClass('disabled')) {
                return;
            }
            $(this.config.refer).trigger('Events::popWithForm');
        },
        'Events::formSuccess': function () {
            this.disabledDom();
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        service.getData({
            url: config.url
        }, function (err, data) {
            if (err) {
                return;
            }
            if (data.isexist === 1) {
                self.disabledDom();
                return;
            }
            self.enableDom();
        });
    },
    enableDom: function () {
        this.config.$el
            .prop('disabled', true)
            .attr('class', 'bt-switch-m');
    },
    disabledDom: function () {
        this.config.$el
            .prop('disabled', true)
            .attr('class', 'bt-switch-ok disabled')
            .text('已兑奖');
    }
});

exports.popupWindButton = Widget.define({
    events:{
        'click': function (e) {
            e.preventDefault();
            $(this.config.refer).trigger('Events::alertPop');
        }
    },
    init: function (config) {
        this.config = config;
    }
});

exports.reducedPopup = Widget.define({
    events: {
        'click [data-role="close"]': 'close',
        'click [data-role="confirmReduced"]': 'confirmReduced',
        'click [data-role="noNeed"]': 'noNeed'
    },
    init: function(config){
        this.config = config;
    },
    close: function(){
        this.config.$el.hide();
        $('#mask').hide();
    },
    confirmReduced: function(){
        var self = this;
        $.ajax({
            url: this.config.exchangeUrl,
            type: 'get',
            dataType: 'json'
        })
        .done(function (data) {
            self.config.$el.hide();
            if (data.ret === 1) {
                $('#checkPrize')
                    .prop('disabled', true)
                    .attr('class', 'bt-switch-ok disabled')
                    .text('已兑换');
                NativeAPI.invoke(
                    'getDeviceInfo',
                    null,
                    function (err, data){
                        $('#mask').addClass('active');
                        if(err && err.code === -32603){
                            $('#lowVersion').addClass('active');
                        }else{
                            if(data.versionId >= '5.11'){
                                $('#successPop').addClass('active');
                            }else{
                                $('#lowVersion').addClass('active');
                            }
                        }
                    }
                );
            }else{
                BasePage.tip(data.msg, 3000);
            }
        });
    },
    noNeed: function(){
        var self = this;
        $.ajax({
            url: this.config.noneedUrl,
            type: 'get',
            dataType: 'json'
        })
        .done(function (data) {
            $('#mask').removeClass('active');
            if(data.ret === 1){
                self.config.$el.hide();
            }else{
                BasePage.tip(data.msg, 3000);
            }
        });
    }
});

