var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var RemoteAPI = require('app/client/app/fang/lib/remoteAPI.js');

var template = require('../template/index.tpl');
var pageData;
require('app/client/app/fang/misc/100_house/style/100_house.css');
exports.init = function (config) {
    RemoteAPI.getData(
        {
            'controller': 'PercentPerson',
            'action': 'getPercentPersonData',
            'domain': config.domain || 'bj'
        },
        function (err, data) {
            NativeAPI.invoke(
                'updateTitle',
                {
                    'text': '100%个人房源'
                }
            );
            pageData = data;
            $('body')
                .removeClass('loading')
                .append(template({
                    list: data.list.slice(1, data.list.length),
                    hostBox: data.list[0],
                    totalAmount: data.totalAmount,
                    totalNum: data.totalNum.toString()
                }))
                .addClass('bg');
            Widget.initWidgets();
        }
    );
};
exports.linkList = Widget.define({
    events : {
        'click [data-role="link"]' : 'createWebView'
    },
    init : function(config){
        this.config = config;
    },
    createWebView : function(e){
        var $target = $(e.currentTarget);
        NativeAPI.invoke(
            'createWebView',
            {
                url: $target.data('href'),
                control: {
                    type: 'title',
                    text: '资讯详情'
                }
            }
        );
    }
});
exports.boxContainer = Widget.define({
    events : {
        'click [data-role="listLink"]' : 'createListView',
        'click [data-role="detailLink"]' : 'createDetailView'
    },
    init: function(config){
        this.config = config;
    },
    createListView : function(){
        NativeAPI.invoke(
            'createNativeView',
            pageData.appListParams
        );
    },
    createDetailView : function(e){
        var $target = $(e.currentTarget);
        NativeAPI.invoke(
            'createNativeView',
            {
                name : 'getPost',
                data : {
                    puid : $target.data('puid'),
                    categoryId : pageData.categoryId
                }
            }
        );
    }
});