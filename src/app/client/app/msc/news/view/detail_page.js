var Widget    = require('com/mobile/lib/widget/widget.js');
var $         = require('$');
var API       = require('../../lib/remoteAPI.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

var template  = require('../template/detail/detail_page.tpl');

var gjLog = require('app/client/common/lib/log/log.js');
var logId = 0;
require('app/client/app/msc/news/style/news.css');

var getData   = function (param, callback) {
    API.getData(param, function (err, data) {
        $('body').removeClass('loading');
        if (err) {
            $('body').addClass('offline');
            return;
        }

        if (!data) {
            $('body').addClass('nothing');
            return;
        }
        if (callback) {
            callback(data);
        }
    });
};
var formaDate = function (time) {
    var date  = new Date(time * 1000);
    var day   = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    var year  = date.getFullYear();
    return year + '-' + month + '-' + day;
};
exports.init = function (config) {
    NativeAPI.invoke('updateHeaderRightBtn',{
        action:'show',
        text: '分享',
        icon: 'share'
    }, function (err) {
        if (err) {
            return;
        }
    });
    logId = config.articleId;
    getData(
        {
            'controller': 'CommonInformationDetail',
            'articleId': config.articleId
        },
        function (data) {
            data.date = formaDate(data.modify);
            $('body')
                .append(template(data));
            NativeAPI.registerHandler('headerRightBtnClick',
                    function () {
                        NativeAPI.invoke('showShareDialog',
                            {
                                text: data.title,
                                title: data.title,
                                content: data.brief,
                                url: data.wapUrl,
                                img: data.images
                            },
                            function (err){
                                if (err) {
                                    window.alert(err);
                                }
                            });
                    });
            gjLog.setGjch('/client/app/msc/news/view/detail_page');
            Widget.initWidgets();
        }
    );
};
exports.showList = function (config) {
    var $el = config.$el;
    var url = config.url;
    $el.on('tap', function (e) {
        e.preventDefault();
        try{
            gjLog.send('info_detail_app_'+ url.name +'@article_id='+ logId);
        }catch(ex){}
        NativeAPI.invoke(
            'createNativeView',
            {
                name: url.name,
                data: url.data
            },
            function (err) {
                if (err) {
                    window.alert('提示：跳转出错！');
                }
            });
    });
};
