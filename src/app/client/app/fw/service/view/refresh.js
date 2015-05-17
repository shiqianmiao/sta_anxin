var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var API = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var pageConfig;
require('app/client/app/fw/service/style/service.css');

exports.init = function (config) {
    pageConfig = config;
    NativeAPI.invoke(
        'getUserInfo',
        null,
        function(err, data) {
            API.getData(
                {
                    'controller': 'Refresh',
                    'action': 'doing',
                    'puid': config.puid,
                    'userid': data.user_id//'50015062'
                },
                function (err, data) {
                    $('body').removeClass('loading');
                    var template;

                    if (!err) {
                        pageConfig.ssid = data.ssid;
                    }

                    if (err || data.status === 0) {//获取数据失败
                        var message = err ? err.message : '';
                        template = require('../template/status/failed.tpl')({message : message});
                    } else if(data.result === 1){
                        template = require('../template/status/succeed.tpl')({data : data});
                    } else if (data.status === -1) {//刷新失败
                        if (data.bang === 0) {//帮帮
                            template = require('../template/status/failed_operate_bang.tpl')({data : data});
                        } else {
                            template = require('../template/status/failed_operate.tpl')({data : data});
                        }
                    }
                    $('body').removeClass('loading').append(template);
                    Widget.initWidgets();
                }
            );
        }
    );
};
exports.getRefreshPoint = Widget.define({
    events: {
        'click [data-role="bangbang"]': function () {
            NativeAPI.invoke(
                'createWebView',
                {
                    url: '/ng/app/client/app/fw/index.html#app/client/app/fw/service/view/intro_page.js',
                    control: {
                        type: 'title',
                        text: '开通帮帮'
                    }
                }
            );
            //window.location.href = '/ng/app/client/app/fw/index.html#app/client/app/fw/service/view/intro_page.js';
        },
        'click [data-role="getpoint"]': function(){
            this.setTitle();
            NativeAPI.invoke(
                'getDeviceInfo',
                null,
                function(err, data) {
                    var source = data.customerId === '705' ? 'ios' : 'android';

                    window.location.href = 'http://3g.ganji.com/bj_refresh/option/?puid=' + pageConfig.puid + '&ifid=ganji_3g_uc_refresh&pp=1&f=buy&ssid=' + pageConfig.ssid + '&source=' + source + '&apptype=b' + '&ver=' + data.versionId;
                }
            );
        }
    },
    init: function (config) {
        this.config = config;
    },
    setTitle: function(title) {
        title = title || '刷新购买';
        NativeAPI.invoke(
            'updateTitle',
            {
                'text': title
            }
        );
    }
});