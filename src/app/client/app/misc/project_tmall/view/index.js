var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('app/client/app/misc/project_tmall/template/index.tpl');
var tmallApi    = require('app/client/app/misc/project_tmall/lib/tmall_api.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var DETAIL_URL  = 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/detail_page.js';
var INDEX_URL   = 'http://sta.ganji.com/ng/app/client/common/index.html#app/client/app/sm/view/index_page.js';
/*style*/
require('../style/style.jcss');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            'text': '积分商城贺新年'
        }
    );
    tmallApi.get('?type=operation', null, function (err, data) {
        var $body = $('body');
        $body.removeClass('loading');
        if (err) {
            $body.addClass('offline');
            return;
        }
        if (!data) {
            $body.addClass('nothing');
            return;
        }
        $.each(data, function(index, item){
            item.icon_text = gIconText(item.icon_tag);
        });
        $body.append(template({data: data}));
        Widget.initWidgets();
    });
};
exports.index = Widget.define({
    events : {
        'click  [data-role="detailLink"]' : function(e){
            NativeAPI.invoke(
                'createWebView',
                {
                    url : DETAIL_URL + '?product_id=' + $(e.currentTarget).data('id')
                }
            );
        },
        'click [data-role="indexLink"]' : function(){
            NativeAPI.invoke(
                'createWebView',
                {
                    url : INDEX_URL
                }
            );
        }
    },
    init : function(config){
        this.config = config;
    }
});
function gIconText(tag){
    var text;
    if (tag === '1') {
        text = '特惠';
    } else if (tag === '2'){
        text = '秒杀';
    } else if (tag === '3'){
        text = '限时';
    }
    return text;
}