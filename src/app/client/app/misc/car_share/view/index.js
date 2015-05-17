var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var CAPI = require('app/client/app/misc/car_share/service/car_share_api.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var template = require('../tpl/index.tpl');
var BasePage = require('app/client/app/misc/car_share/view/base_page.js');
var WeixinApi = require('com/mobile/lib/wxapi/wxapi2.js');

/*style*/
require('../style/style.css');

var addrFlag;

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '找到老乡拼车回家!'
        }
    );
    NativeAPI.invoke('updateHeaderRightBtn',{
        action:'show',
        text: '分享',
        icon: 'share'
    }, function (err) {
        if (err) {
            return;
        }
    });
    $('title').html('赶集群组助你拼车回家');
    $('body').removeClass('loading');
    CAPI.getPv('', function (err, data) {
        var listData = data;
        $('body').append(template({list : listData}));
        CAPI.getProvinceInfo('', function (err,data) {
            if(err){
                return;
            }
            var list = data.list;
            var proTpl = 'app/client/app/misc/car_share/tpl/pop_pro.tpl';
            require.async(proTpl, function (template){
                $('.go-where').append(template({provinceList : list}));
                NativeAPI.registerHandler('headerRightBtnClick',
                    function () {
                        NativeAPI.invoke('showShareDialog',
                            {
                                title: '赶集群组助你春节拼车回家、返程，路途畅聊不寂寞！',
                                text: '赶集群组助你春节拼车回家、返程，路途畅聊不寂寞！',
                                content: '春节回家、返程票还没着落？来赶集群组助你顺利返乡，一路不寂寞！',
                                url: 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/index.js',
                                img: 'http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/wechat.jpg'
                            },
                            function (err){
                                if (err) {
                                    window.alert(err);
                                }
                            });
                    });
                Widget.initWidgets();
                BasePage.bindNativeA();
            });
        });
    });
};

exports.selectWhere = Widget.define({
    events: {
        'tap [data-role="fromWhere"]' : 'getFrom',
        'tap [data-role="toWhere"]' : 'getTo',
        'tap [data-ajax]' : 'getCity',
        'tap [data-value]' : 'setCity',
        'tap [data-role="getHome"]' : 'getHome',
        'tap [data-role="close"]' : 'close'
    },
    init : function(config){
        this.config = config;
        this.fromProvinceId = null;
        this.fromCityId = null;
        this.toProvinceId = null;
        this.toCityId = null;
        this.fromProvinceName = null;
        this.fromCityName = null;
        this.toProvinceName = null;
        this.toCityName = null;
        this.noScroll = false;
        var self = this;
        $('body').on('touchmove', function(e) {
            if (self.noScroll) {
                e.preventDefault();
            }
        });
        this.wxData = config.wxData || {
            title: '赶集群组助你春节拼车回家、返程，路途畅聊不寂寞！',
            desc: '春节回家、返程票还没着落？来赶集群组助你顺利返乡，一路不寂寞！',
            link: 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/misc/car_share/view/index.js',
            imgUrl: 'http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/wechat.jpg'
        };
        var weixin = new WeixinApi();
        self.API = weixin;
        weixin.ready(function (API) {
            self.API = API;
            API.registerShareEvents(self.wxData);
        });
    },
    momentum: function(distance, curY, time, maxScrollY, warpperHeight) {
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
    },
    initScroll: function($warppers) {
        var self = this;
        $warppers.each(function() {
            var curEl = this;
            var $ul = $(curEl).find('ul');
            var startY = 0,
                curY = 0,
                warpperHeight = $(curEl).height(),
                maxScrollY = $(curEl).height() - $(curEl).find('ul').height(),
                startTime = 0,
                startScreenY = 0,
                animating = false;

            if(maxScrollY > 0) {
                maxScrollY = 0;
            }

            var scrollTo = function() {
                if (curY > 0) {
                    curY = 0;
                } else if (curY < 0 && curY < maxScrollY) {
                    curY = maxScrollY;
                }

                animating = false;
                $ul.css({
                    '-webkit-transform': 'translate3d(0, ' + curY + 'px, 0)',
                    'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    '-webkit-transition-duration': 400 + 'ms'
                });
            };

            $(curEl).find('ul')
                .on('touchstart', function(e) {
                    startY = e.changedTouches[0].screenY - curY;
                    startTime = e.timeStamp;

                    startScreenY = e.changedTouches[0].screenY;
                })
                .on('touchmove', function(e) {
                    animating = false;

                    curY = e.changedTouches[0].screenY - startY;
                    if (curY > 0) {
                        curY = curY * 0.4;
                    } else if (curY < maxScrollY) {
                        curY = maxScrollY + (curY - maxScrollY) * 0.4;
                    }

                    $(this).css({
                        '-webkit-transform': 'translate3d(0,' + curY + 'px, 0)',
                        '-webkit-transition-duration': '0'
                    });

                    var timeStamp = e.timeStamp;
                    if (timeStamp - startTime > 280) {
                        startTime = timeStamp;
                        startScreenY = e.changedTouches[0].screenY;
                    }
                })
                .on('touchend', function(e) {
                    var duration = e.timeStamp - startTime;
                    var distance = e.changedTouches[0].screenY - startScreenY;

                    if (animating) {
                        e.preventDefault();
                    }

                    animating = true;
                    if (curY > 0 || curY < maxScrollY) {
                        scrollTo();
                        return;
                    }

                    if (duration < 280) {
                        var newMove = self.momentum(distance, curY, duration, maxScrollY, warpperHeight);

                        curY = newMove.destination;
                        $(this).css({
                            '-webkit-transform': 'translate3d(0, ' + newMove.destination + 'px, 0)',
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
        });
    },
    close: function(){
        $('#cityInfo').removeClass('active');
        $('#proInfoDetail').find('.active').removeClass('active');
        this.noScroll = false;
        this.config.$addrMask.removeClass('active');
    },
    getFrom: function(){
        this.config.$addrMask.addClass('active');
        this.noScroll = true;
        this.initScroll($('#proInfo'));
        addrFlag = 1;
    },
    getTo: function(){
        this.config.$addrMask.addClass('active');
        this.noScroll = true;
        this.initScroll($('#proInfo'));
        addrFlag = 2;
    },
    getCity: function(e){
        e.preventDefault();
        var self = this;
        var $target = $(e.currentTarget);
        if (!$target.hasClass('active')) {
            var $parent = $target.parents('.filter-menu');
            $parent.find('.active').removeClass('active');
            var proId = $target.data('ajax');
            var proName = $target.text();
            if(addrFlag === 1){
                self.fromProvinceId = proId;
                self.fromProvinceName = proName;
            }else{
                self.toProvinceId = proId;
                self.toProvinceName = proName;
            }
            $target.addClass('active');
            CAPI.getCityInfo( proId, function (err, data){
                if(err){
                    return;
                }
                var listData = data.list;
                var cityTpl = 'app/client/app/misc/car_share/tpl/pop_city.tpl';
                require.async(cityTpl, function (template){
                    $('#cityInfo').html(template({cityList : listData}));
                    $('#cityInfo').addClass('active');
                    self.noScroll = true;
                    self.initScroll($('#cityInfo'));
                });
            });
        }
    },
    setCity: function(e){
        e.preventDefault();
        var self = this;
        var $target = $(e.currentTarget);
        var cityId = $target.data('value');
        var cityName = $target.text();
        if(addrFlag === 1){
            self.fromCityId = cityId;
            self.fromCityName = cityName;
            self.config.$fromWhere.html(self.fromProvinceName + '-' + self.fromCityName);
        }else{
            self.toCityId = cityId;
            self.toCityName = cityName;
            self.config.$toWhere.html(self.toProvinceName + '-' + self.toCityName);
        }
        $('.filter-menu').find('.active').removeClass('active');
        self.config.$addrMask.removeClass('active');
        $('#cityInfo').removeClass('active');
        this.noScroll = false;
    },
    getHome: function(){
        var self = this;
        if(self.toProvinceId && self.toCityId && self.fromCityId){
            var params = {
                provinceId : self.toProvinceId,
                cityId : self.toCityId,
                curCityId : self.fromCityId
            };
            CAPI.ImGetHomeGroup ( params, function (err, data){
                if (err && err.message === '网络异常') {
                    $('body')
                        .removeClass('loading')
                        .addClass('offline');
                    return;
                }else{
                    var listData = data.data.groupList;
                    listData.cityId = self.fromCityId;
                    var popTpl = 'app/client/app/misc/car_share/tpl/pop_group.tpl';
                    require.async( popTpl,function (template){
                        $('body').append(template({groupList : listData}));
                        self.noScroll = false;
                    });
                }
            });
        }
    }
});

exports.pop = Widget.define({
    events: {
        'tap [data-role="carPic"]' : 'showImg',
        'tap [data-role="bigImg"]' : 'close'
    },
    init : function(config){
        this.config = config;
    },
    close: function(){
        this.config.$bigImg.removeClass('active');
    },
    showImg: function(e){
        var $target = $(e.currentTarget);
        var selfConfig = this.config;
        selfConfig.$imgSrc[0].src = $target[0].src;
        if($target[0].src === 'http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/pic3.jpg'){
            selfConfig.$picTip.html('2月4日，北京，小晶从群组中找到其他两位同乡，即将启程回江苏');
        }else if($target[0].src === 'http://stacdn201.ganjistatic1.com/att/project/touch/group_car_sharing/img/pic1.jpg'){
            selfConfig.$picTip.html('2月6日，沈阳，小雷和好友老白，在群组中约到同乡老王，一起拼车回山西');
        }else{
            selfConfig.$picTip.html('2月7日，上海，小雨和小王，两人都是销售，在群组中拼车时相遇，结伴南下回乡');
        }
        selfConfig.$bigImg.addClass('active');
    }
});
