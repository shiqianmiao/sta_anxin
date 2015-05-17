var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var template    = require('app/client/app/sm/template/prize/exchange_page.tpl');
var DataParser  = require('app/client/app/sm/util/date_parse.js');
var SMAPI       = require('app/client/app/sm/service/sm_api.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var BasePage    = require('app/client/app/sm/view/base_page.js');
var shareConfig = BasePage.shareConfig;
require('../../style/style.css');

exports.init = function (config) {
    var thePrize = config.prize_info;

    NativeAPI.invoke(
        'updateTitle',
        {
            'text': !!thePrize.is_from_choujiang ? '领奖' : '兑奖'
        }
    );
    BasePage.setGjch('client/app/sm/view/prize/exchange_page');
    NativeAPI.invoke('updateHeaderRightBtn',{
        action:'show',
        text: '分享',
        icon: 'share'
    }, function (err) {
        if (err) {
            return;
        }
        BasePage.log('exchange_share');
    });
    SMAPI.getProductDetail(thePrize.product_id, function (err, data) {
        var data  = $.extend(data, thePrize);
        config.prize_info.imgUrl = data.detail_img_url;
        data.openDate = data.bought_time && DataParser.parseToYMD(data.bought_time * 1000, true);
        if (thePrize.product_type !== 10) {
            data.endDate  = data.code_expire && DataParser.parseToYMD(data.code_expire * 1000, true);
        }
        NativeAPI.registerHandler('headerRightBtnClick',
            function () {
                NativeAPI.invoke('showShareDialog',
                    {
                        text: shareConfig.title,
                        title: shareConfig.title,
                        content: shareConfig.brief,
                        url: shareConfig.wapUrl + '?prize_info=' + window.encodeURIComponent(JSON.stringify(config.prize_info)),
                        img: shareConfig.images
                    },
                    function (err){
                        if (err) {
                            window.alert(err);
                        }
                    });
            });
        $('body')
        .removeClass('loading')
        .append(template({data: $.extend(data, thePrize)}));

        Widget.initWidgets();
    });

};