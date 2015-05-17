var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var myadAPI = require('app/client/app/myad/lib/myad_api.js');
var myadUtil = require('../lib/myad_util.js');
var alert = myadUtil.alert;
var template = require('../template/extension-customer.tpl');
var pageTemplate = require('../template/customer-page.tpl');
require('app/client/app/myad/style/coupons.jcss');
require('app/client/app/myad/style/touch_global.jcss');
var pageConfig;
var pageCount;
var nativeApiSupport = NativeAPI.isSupport();
NativeAPI.invoke('updateTitle', {
    text : '有意向的在线客户'
});
exports.init = function (config) {
    pageConfig = config;
    getData(0, function(data){
        pageCount = data.page_count;
        recombineData(data);
        $('body').removeClass('loading').attr('class', 'balance fixed-area').append(template({
            data : data,
            hideTitle : nativeApiSupport
        }));
        renderPage(1, data);
        Widget.initWidgets();
    });
};
exports.pageManage = Widget.define({
    events : {
        'click [data-role="back"]' : function(){
            window.history.back();
        },
        'click [data-role="prev"]' : function(){
            var currentPage = parseInt(this.config.$pageId.text(), 10);
            var prevPage = currentPage - 1;
            if (currentPage === 1) {
                return;
            } else {
                this.config.$pagebody.hide();
                renderPage(prevPage);
                this.config.$pageId.text(prevPage);
            }
        },
        'click [data-role="next"]' : function(){
            var self = this;
            var currentPage = parseInt(this.config.$pageId.text(), 10);
            var nextPage = currentPage + 1;
            var $page = $('.page' + nextPage);
            if (currentPage === pageCount) {
                return;
            } else {
                if ($page.data('ready')) {
                    this.nextPage(nextPage);
                } else {
                    getData(nextPage - 1, function(data){
                        recombineData(data);
                        self.nextPage(nextPage, data);
                    });
                }
            }
        },
        'click [data-role="chat"]' : function(e){
            var $target = $(e.currentTarget);
            window.location.href = 'http://dingdong.ganji.com/3g/dialogue.html?userId=' + $target.data('id') + '&puid=' + pageConfig.puid + '&ifid=3g_selfpromotion_communication_click';
        }
    },
    nextPage : function(nextPage, data){
        this.config.$pagebody.hide();
        renderPage(nextPage, data);
        this.config.$pageId.text(nextPage);
    },
    init : function(config){
        this.config = config;
    }
});
function getData(page, callback){
    myadAPI.getClickRecord({
        puid : pageConfig.puid,
        page_id : page
    }, function(err, data){
        if (err) {
            $('body').removeClass('loading').addClass('nothing');
            return alert(err.message);
        }
        callback && callback(data);
    });
}
function renderPage(page, data){
    var $page = $('.page' + page);

    if (!$page.data('ready')) {
        if (data) {
            $page.append(pageTemplate({
                data : data,
                hideLink : nativeApiSupport
            }));
        }
        !$page.data('ready', 1);
    }
    $page.show();
}
function recombineData(data){
    $.each(data.click_record, function(index, item){
        var timeArray = item.click_time.split(' ');
        item.index = index + 1;
        item.date = timeArray[0];
        item.time = timeArray[1];
    });
}