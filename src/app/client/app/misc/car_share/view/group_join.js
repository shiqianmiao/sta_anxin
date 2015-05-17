var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var CAPI = require('app/client/app/misc/car_share/service/car_share_api.js');
var template = require('app/client/app/misc/car_share/tpl/group_join.tpl');
var Util = require('app/client/common/lib/util/util.js');
var indexAPI = require('app/client/common/lib/api/index.js');


/*style*/
require('../style/style.css');
var groupid;
var curCity;

exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '群组资料'
        }
    );
    groupid = config.group_id;
    curCity = config.city_id;
    CAPI.ImGetGroupInfo({
        groupId : config.group_id
    }, function(err, data){
        if (err && err.message === '网络异常') {
            $('body')
                .removeClass('loading')
                .addClass('offline');

            return;
        }

        var createDate = new Date(data.data.createTime * 1000);
        var labels = '';

        $.each(data.data.labels, function(index, item){
            labels += item + ' ';
        });
        $('body').removeClass('loading').append(template({
            data : data.data,
            labels : labels,
            createTime : createDate.getFullYear() + '年' + (createDate.getMonth() + 1) + '月' + createDate.getDate() + '日'
        }));
        Widget.initWidgets();
    });
};

exports.joinGroup = Widget.define({
    events: {
        'click [data-role="wapBtn"]': 'submit',
        'click [data-role="appBtn"]' : 'join'
    },
    init: function(config) {
        this.config = config;
        $('body').addClass('no-bg');
        if(NativeAPI.isSupport()){
            if(curCity){
                this.config.$appFooter.addClass('active');
            }
        }else{
            this.config.$wapFooter.addClass('active');
        }
    },
    join: function() {
        var self = this;
        var message = {
            groupId : groupid,
            curCityId : curCity
        };
        indexAPI.invoke(
            'getDeviceInfo',
            null,
            function(err, deviceInfo){
                if (err) {
                    deviceInfo = {
                        'token': '52617950743134537162574f30614f6352615657472f2b6f'
                    };
                }
                if(deviceInfo.token){
                    message.token = deviceInfo.token;
                }else{
                    message.token = '52617950743134537162574f30614f6352615657472f2b6f';
                }
                NativeAPI.invoke('getUserInfo', null, function (err) {
                    if (err) {
                        Util.toast('您未登录，请返回到客户端中登录后再试');
                    }else{
                        CAPI.ImApplyJoinGroupBySelf( message, function (err, data) {
                            if(err){
                                if(err.code === 40006){
                                    self.config.$appBtn.html('请注册群聊后加群');
                                }
                                return;
                            }
                            if(data.errorCode === 0){
                                Util.toast('加群成功，请返回app首页右下角进入群组后畅聊吧~');
                                self.config.$appBtn.html('加群成功');
                            }else{
                                Util.toast(data.errorMsg);
                            }
                        });
                    }
                });
            }
        );
    },
    submit: function() {
        var config = this.config;
        var ua = window.navigator.userAgent;

        if (ua.match(/MicroMessenger/i)) {
            window.location.href = config.weixinAppUrl;
        } else {
            window.location.href = config.ganjiShenghuoApp;

            setTimeout(function() {
                window.location.href = config.ganjiShenghuoDownload;
            }, 1000);
        }
    }
});